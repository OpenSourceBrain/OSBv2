#!/bin/bash
# Argo task behind POST /workspace/{id}/run: runs a repository's notebooks on the workspace volume.
#
# Runs in the image the request names (OSB's JupyterLab without one), mounted there from the
# workspaces-run-notebooks ConfigMap: it needs only bash and python from the image.
#
# Inputs: environment variables set by service/workflow.py from the request. Paths are relative to
# the volume, already checked by the controller; lists have one item per line.
#   repo_dir                      the repository, as imported; left as it is
#   project_dir                   where the run works, the folder repo_dir is in (the run's folder):
#                                 the repository's files are copied there and the notebooks run from
#                                 there, as they would from the repository
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

relative_to() {  # $1 = path, $2 = folder: $1 as a path relative to $2
    python -c 'import os, sys; print(os.path.relpath(sys.argv[1], sys.argv[2]))' "$1" "$2"
}

# ── Inputs: read and check before anything is touched ───────────────────────────────────────

for name in repo_dir project_dir notebooks output_dir executed_notebooks_dir log_file; do
    [ -n "${!name:-}" ] || fail "$name is not set"
done
read_list notebooks notebook_list
read_list python_path python_path_list
read_list install install_list
repo_path="${volume_root}/${repo_dir}"
project_path="${volume_root}/${project_dir}"
[ -d "$repo_path" ] || fail "${repo_dir} is not on the workspace volume"
[ -z "${input_dir:-}" ] || [ -e "${volume_root}/${input_dir}" ] || fail "${input_dir} is not on the workspace volume"

log_path="${volume_root}/${log_file}"
# The run's folder may already hold its data and repository; never mix two runs' results.
[ ! -e "$log_path" ] || fail "${log_file} already exists: this run has already happened"

# The executed notebooks are written to <dir>.running, and on exit they go to <dir> if every
# notebook passed, or the folder becomes <dir>.failed if not: <dir> listing them means the whole run
# succeeded.
results_path="${volume_root}/${executed_notebooks_dir}"
running_dir="${results_path}.running"
failed_dir="${results_path}.failed"
for folder in "$results_path" "$running_dir" "$failed_dir"; do
    [ ! -e "$folder" ] || fail "${folder#"${volume_root}/"} already exists: this run has already happened"
done

# ── Log, and the outcome on exit ───────────────────────────────────────────────────────────

# On exit, success or failure: record the outcome, and keep the run's exit status. (Ownership for
# JupyterLab is set by the workflow's scan, which runs after.)
save_on_exit() {
    local status=$?
    set +e
    if [ -d "$running_dir" ]; then
        if [ "$status" -eq 0 ]; then
            mkdir -p "$results_path" && find "$running_dir" -mindepth 1 -maxdepth 1 -exec mv -f {} "$results_path"/ \; \
                && rmdir "$running_dir"
        else
            mv "$running_dir" "$failed_dir"
        fi
    fi
    # The notebooks may have run from <dir> (made for them, as the repository has them there): a
    # failed run leaves it only if something was written in it.
    [ "$status" -eq 0 ] || rmdir "$results_path" 2>/dev/null
    exit "$status"
}
trap save_on_exit EXIT

mkdir -p "$(dirname "$log_path")"
exec > >(tee -a "$log_path") 2>&1
echo "Run ${run_id:-?}: ${repo_dir} in ${project_dir}"

# ── 1. The repository's files in the project folder ───────────────────────────────────────────

# Everything but what the project folder already has (e.g. the run's inputs and outputs), and the
# executed notebooks' folder: the executed notebooks take the originals' place there. The output
# folder is made first, so the repository's own (e.g. its example outputs) isn't copied into it.
mkdir -p "$project_path" "${volume_root}/${output_dir}"
while IFS= read -r -d '' entry; do
    name=$(basename "$entry")
    if [ "${project_path}/${name}" = "$results_path" ]; then
        continue
    elif [ -e "${project_path}/${name}" ]; then
        echo "Not copied from the repository: ${name} (${project_dir} has its own)"
    else
        cp -a "$entry" "${project_path}/"
    fi
done < <(find "$repo_path" -mindepth 1 -maxdepth 1 -print0)
# Deeper in the repository (e.g. analysis/notebooks), the executed notebooks' folder came with the
# copy (it didn't exist before: checked above). Its originals would read as executed notebooks.
if [ -e "$results_path" ]; then rm -rf "${results_path:?}"; fi

# ── Clean environment for the repository's own code ─────────────────────────────────────────

# The repository's code runs without the CH_* variables CloudHarness copies from the workspaces
# server (CH_SECRET among them), only with what is listed here. The credential files are kept out
# of the pod by RunNotebooksTask (service/workflow.py). The image's python stays first on PATH
# (e.g. /opt/conda/bin in the Jupyter images).
python_bin=$(command -v python) || fail "the image has no python"
clean_env=(env -i PATH="$(dirname "$python_bin"):/usr/local/bin:/usr/bin:/bin" HOME=/tmp LANG=C.UTF-8 PYTHONDONTWRITEBYTECODE=1 MPLBACKEND=Agg
    PIP_DISABLE_PIP_VERSION_CHECK=1 PIP_ROOT_USER_ACTION=ignore PIP_NO_CACHE_DIR=1)
for name in HTTP_PROXY HTTPS_PROXY NO_PROXY http_proxy https_proxy no_proxy PIP_INDEX_URL PIP_EXTRA_INDEX_URL; do
    if [ -n "${!name:-}" ]; then clean_env+=("${name}=${!name}"); fi
done

# ── 2. papermill if the image hasn't it, then requirements (a failure stops the run) ─────────

if ! "${clean_env[@]}" python -c 'import papermill, ipykernel' 2>/dev/null; then
    echo "Installing papermill and ipykernel (not in the image)"
    "${clean_env[@]}" python -m pip install papermill ipykernel \
        || fail "pip install papermill ipykernel failed; see ${log_file}"
fi

if [ -n "${requirements:-}" ]; then
    if [ -f "${project_path}/${requirements}" ]; then
        echo "Installing ${requirements}"
        (cd "$project_path" && "${clean_env[@]}" python -m pip install -r "$requirements") \
            || fail "pip install -r ${requirements} failed; see ${log_file}"
    else
        echo "No ${requirements} in the repository; nothing to install"
    fi
fi

# ── 3. PYTHONPATH and the first install candidate the repository has (not fatal) ───────────

pythonpath=""
for folder in "${python_path_list[@]}"; do
    if [ -d "${project_path}/${folder}" ]; then pythonpath="${pythonpath:+${pythonpath}:}${project_path}/${folder}"
    else echo "No ${folder}/ in the repository; not on PYTHONPATH"; fi
done
[ -z "$pythonpath" ] || clean_env+=("PYTHONPATH=${pythonpath}")

for candidate in "${install_list[@]}"; do
    [ -f "${project_path}/${candidate}" ] || continue
    echo "Installing with ${candidate}"
    case "$(basename "$candidate")" in
        setup.py|pyproject.toml)
            "${clean_env[@]}" python -m pip install "$(dirname "${project_path}/${candidate}")" \
                || echo "WARNING: installing with ${candidate} failed" ;;
        *)
            (cd "$(dirname "${project_path}/${candidate}")" && "${clean_env[@]}" python "${project_path}/${candidate}") \
                || echo "WARNING: ${candidate} failed" ;;
    esac
    break
done

# ── 4. The notebooks, in order, each from its own folder (the first failure stops the run) ───

# The notebooks read from INPUT_DIR and write to OUTPUT_DIR, set in a cell tagged `parameters`
# (papermill's way); a notebook without one would ignore them, so it isn't run.
has_parameters_cell() {  # $1 = notebook
    python -c 'import json, sys; nb = json.load(open(sys.argv[1]))
sys.exit(0 if any("parameters" in c.get("metadata", {}).get("tags", []) for c in nb["cells"]) else 1)' "$1"
}
mkdir -p "${volume_root}/${output_dir}" "$running_dir"

echo "Notebooks: ${notebook_list[*]}"
for nb in "${notebook_list[@]}"; do
    [ -f "${repo_path}/${nb}" ] || fail "${nb} is not in the repository"
    has_parameters_cell "${repo_path}/${nb}" || fail "${nb} has no cell tagged parameters (INPUT_DIR, OUTPUT_DIR)"
    echo "Running ${nb}"
    # Its own folder in the project, as in the repository: what it imports or reads next to itself
    # is found as it would be there.
    notebook_dir="${project_path}/$(dirname "$nb")"
    mkdir -p "$notebook_dir"
    # Relative to that folder, so the executed notebook can be run again from it in JupyterLab
    # (which mounts the volume elsewhere).
    parameters=(-p OUTPUT_DIR "$(relative_to "${volume_root}/${output_dir}" "$notebook_dir")")
    [ -z "${input_dir:-}" ] || parameters+=(-p INPUT_DIR "$(relative_to "${volume_root}/${input_dir}" "$notebook_dir")")
    executed="${running_dir}/$(basename "$nb")"
    "${clean_env[@]}" python -m papermill --kernel python3 --execution-timeout "$CELL_TIMEOUT_SECONDS" \
        --cwd "$notebook_dir" "${repo_path}/${nb}" "$executed" "${parameters[@]}" \
        || fail "${nb} failed; see ${executed_notebooks_dir}.failed/$(basename "$nb")"
done
echo "Done"
