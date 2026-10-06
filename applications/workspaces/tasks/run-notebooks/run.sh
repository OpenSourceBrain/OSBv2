#!/bin/bash
# Argo task behind POST /workspace/{id}/run: runs a repository's notebooks on the workspace volume.
# Steps and outputs: see README.md.
#
# Inputs: environment variables set by service/workflow.py from the request. Paths are relative to
# the volume, already checked by the controller; lists have one item per line.
#   repo_dir, discard_repo        the repository; "true": remove it from the volume once copied
#   notebooks                     the notebooks to run, in this order, relative to repo_dir
#   input_dir, output_dir         the notebooks' INPUT_DIR and OUTPUT_DIR (input_dir is optional:
#                                 without it the notebooks use their own default)
#   requirements, python_path,    optional set-up, relative to repo_dir: a requirements file,
#   install                       folders for PYTHONPATH, install candidates (the first found is used)
#   executed_notebooks_dir,       where the executed notebooks and the run's log go
#   log_file

set -euo pipefail

# A cell still running after this long is stopped, and its notebook fails.
CELL_TIMEOUT_SECONDS=3600

# shared_directory is <volume>:<mount path>:<mode>, as for OSB's copy tasks.
mount=${shared_directory:-volume:/project_download}
volume_root=${mount#*:} && volume_root=${volume_root%%:*}

# ── Helpers ──────────────────────────────────────────────────────────────────────────────────

fail() {
    echo "ERROR: $*" >&2
    # Kubernetes' termination message: Argo shows it as the step's message.
    echo "$*" > /dev/termination-log 2>/dev/null || true
    exit 1
}

read_list() {  # $1 = variable holding one item per line, $2 = array to fill (empty if unset)
    local -n into=$2
    into=()
    [ -z "${!1:-}" ] || mapfile -t into <<< "${!1}"
}

# ── Inputs: read and check before anything is touched ───────────────────────────────────────

for name in repo_dir notebooks output_dir executed_notebooks_dir log_file; do
    [ -n "${!name:-}" ] || fail "$name is not set"
done
read_list notebooks notebook_list
read_list python_path python_path_list
read_list install install_list
[ -z "${input_dir:-}" ] || [ -e "${volume_root}/${input_dir}" ] || fail "${input_dir} is not on the workspace volume"

log_path="${volume_root}/${log_file}"
# The run's folder may already hold its data and repository; never mix two runs' results.
[ ! -e "$log_path" ] || fail "${log_file} already exists: this run has already happened"

# The executed notebooks are written to <dir>.running, and on exit the folder becomes <dir> if every
# notebook passed or <dir>.failed if not: <dir> existing means the whole run succeeded.
running_dir="${volume_root}/${executed_notebooks_dir}.running"
failed_dir="${volume_root}/${executed_notebooks_dir}.failed"
for folder in "${volume_root}/${executed_notebooks_dir}" "$running_dir" "$failed_dir"; do
    [ ! -e "$folder" ] || fail "${folder#"${volume_root}/"} already exists: this run has already happened"
done

# ── Log, and the outcome on exit ───────────────────────────────────────────────────────────

scratch_dir=$(mktemp -d /tmp/run-XXXXXX)
repo_copy="${scratch_dir}/repo"

# On exit, success or failure: record the outcome in the executed notebooks' folder name, and keep
# the run's exit status. (Ownership for JupyterLab is set by the workflow's scan, which runs after.)
save_on_exit() {
    local status=$?
    set +e
    if [ -d "$running_dir" ]; then
        if [ "$status" -eq 0 ]; then mv "$running_dir" "${volume_root}/${executed_notebooks_dir}"
        else mv "$running_dir" "$failed_dir"; fi
    fi
    exit "$status"
}
trap save_on_exit EXIT

mkdir -p "$(dirname "$log_path")"
exec > >(tee -a "$log_path") 2>&1
echo "Run ${run_id:-?}: ${repo_dir}"

# ── 1. Scratch copy of the repository ──────────────────────────────────────────────────────

mkdir -p "$repo_copy" && cp -a "${volume_root}/${repo_dir}/." "${repo_copy}/"
# The run works on the copy from here on; with discard_repo the next run imports a fresh one.
if [ "${discard_repo:-}" = "true" ]; then
    rm -rf "${volume_root:?}/${repo_dir:?}" && echo "Removed ${repo_dir} from the workspace (discard_repo)"
fi

# ── Clean environment for the repository's own code ─────────────────────────────────────────

# The repository's code runs without the CH_* variables CloudHarness copies from the workspaces
# server (CH_SECRET among them), only with what is listed here. The credential files are kept out
# of the pod by RunNotebooksTask (service/workflow.py).
clean_env=(env -i PATH=/usr/local/bin:/usr/bin:/bin HOME=/tmp LANG=C.UTF-8 PYTHONDONTWRITEBYTECODE=1 MPLBACKEND=Agg
    PIP_DISABLE_PIP_VERSION_CHECK=1 PIP_ROOT_USER_ACTION=ignore PIP_NO_CACHE_DIR=1)
for name in HTTP_PROXY HTTPS_PROXY NO_PROXY http_proxy https_proxy no_proxy PIP_INDEX_URL PIP_EXTRA_INDEX_URL; do
    if [ -n "${!name:-}" ]; then clean_env+=("${name}=${!name}"); fi
done

# ── 2. Requirements (a failure stops the run) ─────────────────────────────────────────────────

if [ -n "${requirements:-}" ]; then
    if [ -f "${repo_copy}/${requirements}" ]; then
        echo "Installing ${requirements}"
        (cd "$repo_copy" && "${clean_env[@]}" python -m pip install -r "$requirements") \
            || fail "pip install -r ${requirements} failed; see ${log_file}"
    else
        echo "No ${requirements} in the repository; nothing to install"
    fi
fi

# ── 3. PYTHONPATH and the first install candidate the repository has (not fatal) ───────────

pythonpath=""
for folder in "${python_path_list[@]}"; do
    if [ -d "${repo_copy}/${folder}" ]; then pythonpath="${pythonpath:+${pythonpath}:}${repo_copy}/${folder}"
    else echo "No ${folder}/ in the repository; not on PYTHONPATH"; fi
done
[ -z "$pythonpath" ] || clean_env+=("PYTHONPATH=${pythonpath}")

for candidate in "${install_list[@]}"; do
    [ -f "${repo_copy}/${candidate}" ] || continue
    echo "Installing with ${candidate}"
    case "$(basename "$candidate")" in
        setup.py|pyproject.toml)
            "${clean_env[@]}" python -m pip install "$(dirname "${repo_copy}/${candidate}")" \
                || echo "WARNING: installing with ${candidate} failed" ;;
        *)
            (cd "$(dirname "${repo_copy}/${candidate}")" && "${clean_env[@]}" python "${repo_copy}/${candidate}") \
                || echo "WARNING: ${candidate} failed" ;;
    esac
    break
done

# ── 4. The notebooks, in order, each in its own folder (the first failure stops the run) ────

# The notebooks read from INPUT_DIR and write to OUTPUT_DIR, set in a cell tagged `parameters`
# (papermill's way); a notebook without one would ignore them, so it isn't run.
has_parameters_cell() {  # $1 = notebook
    python -c 'import json, sys; nb = json.load(open(sys.argv[1]))
sys.exit(0 if any("parameters" in c.get("metadata", {}).get("tags", []) for c in nb["cells"]) else 1)' "$1"
}
parameters=(-p OUTPUT_DIR "${volume_root}/${output_dir}")
[ -z "${input_dir:-}" ] || parameters+=(-p INPUT_DIR "${volume_root}/${input_dir}")
mkdir -p "${volume_root}/${output_dir}" "$running_dir"

echo "Notebooks: ${notebook_list[*]}"
for nb in "${notebook_list[@]}"; do
    [ -f "${repo_copy}/${nb}" ] || fail "${nb} is not in the repository"
    has_parameters_cell "${repo_copy}/${nb}" || fail "${nb} has no cell tagged parameters (INPUT_DIR, OUTPUT_DIR)"
    echo "Running ${nb}"
    executed="${running_dir}/$(basename "$nb")"
    "${clean_env[@]}" python -m papermill --kernel python3 --execution-timeout "$CELL_TIMEOUT_SECONDS" \
        --cwd "$(dirname "${repo_copy}/${nb}")" "${repo_copy}/${nb}" "$executed" "${parameters[@]}" \
        || fail "${nb} failed; see ${executed_notebooks_dir}.failed/$(basename "$nb")"
done
echo "Done"
