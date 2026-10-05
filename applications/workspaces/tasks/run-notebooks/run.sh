#!/bin/bash
# Argo task behind POST /workspace/{id}/run: runs a repository's notebooks on the workspace volume.
# Inputs, steps and outputs: see README.md.

set -euo pipefail

# A cell still running after this long is stopped, and its notebook fails.
CELL_TIMEOUT_SECONDS=3600

volume_root=$(echo "${shared_directory:-/project_download}" | cut -d ":" -f 2)
volume_root=${volume_root:-/project_download}

# ── Helpers ──────────────────────────────────────────────────────────────────────────────────

fail() {
    echo "ERROR: $*" >&2
    # Kubernetes' termination message: Argo shows it as the step's message.
    echo "$*" > /dev/termination-log 2>/dev/null || true
    exit 1
}

require_relative() {  # $1 = name, $2 = value: a path inside the volume or the repository
    case "/$2/" in
        //*|*/../*|*/./*) fail "$1 must be a relative path and must not contain '..'" ;;
    esac
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
for path in "$repo_dir" "$output_dir" "$executed_notebooks_dir" "$log_file" "${notebook_list[@]}" \
        "${python_path_list[@]}" "${install_list[@]}" ${input_dir:+"$input_dir"} ${requirements:+"$requirements"}; do
    require_relative "$path" "$path"
done
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

# ── Log, and the results' owner on exit ─────────────────────────────────────────────────────

scratch_dir=$(mktemp -d /tmp/run-XXXXXX)
repo_copy="${scratch_dir}/repo"

# On every exit, failures included. Keeps the run's exit status, so a problem here can't turn a
# finished run into a failed one.
save_on_exit() {
    local status=$?
    set +e
    if [ -d "$running_dir" ]; then
        if [ "$status" -eq 0 ]; then mv "$running_dir" "${volume_root}/${executed_notebooks_dir}"
        else mv "$running_dir" "$failed_dir"; fi
    fi
    # The task runs as root; hand what was written, and the folders above the log, to the notebook user.
    written=("${volume_root}/${output_dir}" "${volume_root}/${executed_notebooks_dir}" "$failed_dir" "$(dirname "$log_path")")
    for folder in "${written[@]}"; do [ -d "$folder" ] && chown -R 1000:100 "$folder"; done
    parent=$(dirname "$(dirname "$log_file")")
    while [ "$parent" != "." ]; do
        chown 1000:100 "${volume_root}/${parent}"
        parent=$(dirname "$parent")
    done
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

# It must not see the CH_* variables this container inherits from the workspaces server. Only
# what pip may need (a proxy or a mirror) is passed through.
clean_env=(env -i PATH=/usr/local/bin:/usr/bin:/bin HOME=/tmp LANG=C.UTF-8 PYTHONDONTWRITEBYTECODE=1 MPLBACKEND=Agg)
for name in HTTP_PROXY HTTPS_PROXY NO_PROXY http_proxy https_proxy no_proxy PIP_INDEX_URL PIP_EXTRA_INDEX_URL; do
    if [ -n "${!name:-}" ]; then clean_env+=("${name}=${!name}"); fi
done

# ── 2. Requirements (a failure stops the run) ─────────────────────────────────────────────────

if [ -n "${requirements:-}" ]; then
    if [ -f "${repo_copy}/${requirements}" ]; then
        echo "Installing ${requirements}"
        (cd "$repo_copy" && "${clean_env[@]}" python -m pip install --disable-pip-version-check \
            --root-user-action=ignore --no-cache-dir -r "$requirements") || fail "pip install -r ${requirements} failed; see ${log_file}"
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
            "${clean_env[@]}" python -m pip install --disable-pip-version-check --root-user-action=ignore \
                --no-cache-dir "$(dirname "${repo_copy}/${candidate}")" || echo "WARNING: installing with ${candidate} failed" ;;
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
mkdir -p "${volume_root}/${output_dir}"

echo "Notebooks: ${notebook_list[*]}"
for nb in "${notebook_list[@]}"; do
    [ -f "${repo_copy}/${nb}" ] || fail "${nb} is not in the repository"
    has_parameters_cell "${repo_copy}/${nb}" || fail "${nb} has no cell tagged parameters (INPUT_DIR, OUTPUT_DIR)"
    echo "Running ${nb}"
    executed="${running_dir}/$(basename "$nb")"
    mkdir -p "$running_dir"
    (cd "$(dirname "${repo_copy}/${nb}")" && "${clean_env[@]}" python -m papermill --kernel python3 \
        --execution-timeout "$CELL_TIMEOUT_SECONDS" --cwd "$(dirname "${repo_copy}/${nb}")" "${repo_copy}/${nb}" "$executed" "${parameters[@]}") \
        || fail "${nb} failed; see ${executed_notebooks_dir}.failed/$(basename "$nb")"
done
echo "Done"
