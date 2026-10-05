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
    # Kubernetes' termination message: Argo shows it as the step's message, so the reason
    # reaches GET /workspace/{id}/run/{workflow}.
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

for name in repo_dir notebooks output_dir; do
    [ -n "${!name:-}" ] || fail "$name is not set"
done
read_list notebooks notebook_list
read_list outputs outputs_list
read_list python_path python_path_list
read_list install install_list
for path in "$repo_dir" "$output_dir" "${notebook_list[@]}" "${outputs_list[@]}" "${python_path_list[@]}" "${install_list[@]}" \
        ${input_path:+"$input_path"} ${input_dir:+"$input_dir"} ${requirements:+"$requirements"}; do
    require_relative "$path" "$path"
done
# The data reaches the notebooks only by being put in input_dir.
[ -z "${input_path:-}" ] || [ -n "${input_dir:-}" ] || fail "input_dir is required with input_path"

results_dir="${volume_root}/${output_dir}"
# Each run has its own folder; never mix two runs' results.
[ ! -e "$results_dir" ] || fail "the results folder ${output_dir} already exists"

# ── Results folder, log, and what is saved on exit ──────────────────────────────────────────

scratch_dir=$(mktemp -d /tmp/run-XXXXXX)
repo_copy="${scratch_dir}/repo"

# On every exit, failures included: partial results are worth keeping. Keeps the run's exit
# status, so a problem here can't turn a finished run into a failed one.
save_on_exit() {
    local status=$?
    set +e
    for folder in "${outputs_list[@]}"; do
        if [ -d "${repo_copy}/${folder}" ]; then
            mkdir -p "${results_dir}/${folder}" && cp -a "${repo_copy}/${folder}/." "${results_dir}/${folder}/" \
                || echo "WARNING: could not save ${folder}/ to the results"
        fi
    done
    # The task runs as root; hand the results, and the folders above them, to the notebook user.
    if [ -d "$results_dir" ]; then
        chown -R 1000:100 "$results_dir"
        parent=$(dirname "$output_dir")
        while [ "$parent" != "." ]; do
            chown 1000:100 "${volume_root}/${parent}"
            parent=$(dirname "$parent")
        done
    fi
    exit "$status"
}
trap save_on_exit EXIT

mkdir -p "$results_dir"
exec > >(tee -a "${results_dir}/run.log") 2>&1
echo "Run ${run_id:-?}: ${repo_dir} -> ${output_dir}"

# ── 1. Scratch copy of the repository ──────────────────────────────────────────────────────

mkdir -p "$repo_copy" && cp -a "${volume_root}/${repo_dir}/." "${repo_copy}/"

# ── 2. Empty the outputs folders, put the data in input_dir ─────────────────────────────────

# Results committed to the repository would otherwise pass for this run's.
for folder in "${outputs_list[@]}"; do
    rm -rf "${repo_copy:?}/${folder}" && mkdir -p "${repo_copy}/${folder}"
done

if [ -n "${input_path:-}" ]; then
    data_source="${volume_root}/${input_path}"
    # A zip of one folder is unpacked by the import into a single subfolder: use that folder.
    # OS metadata (macOS's __MACOSX/, hidden files) is not data and is skipped.
    if [ -d "$data_source" ]; then
        mapfile -t entries < <(find "$data_source" -mindepth 1 -maxdepth 1 ! -name '__MACOSX' ! -name '.*')
        if [ "${#entries[@]}" -eq 1 ] && [ -d "${entries[0]}" ]; then data_source="${entries[0]}"; fi
    fi
    data_dest="${repo_copy}/${input_dir}"
    rm -rf "$data_dest" && mkdir -p "$data_dest"
    if [ -d "$data_source" ]; then
        (cd "$data_source" && find . -mindepth 1 -maxdepth 1 ! -name '__MACOSX' ! -name '.*' -exec cp -a {} "$data_dest/" \;)
    else
        cp -a "$data_source" "$data_dest/"
    fi
    echo "Input: ${input_path} -> ${input_dir}/ ($(ls -1 "$data_dest" | wc -l | tr -d ' ') files)"
fi

# ── Clean environment for the repository's own code ─────────────────────────────────────────

# It must not see the CH_* variables this container inherits from the workspaces server. Only
# what pip may need (a proxy or a mirror) is passed through.
clean_env=(env -i PATH=/usr/local/bin:/usr/bin:/bin HOME=/tmp LANG=C.UTF-8 PYTHONDONTWRITEBYTECODE=1 MPLBACKEND=Agg)
for name in HTTP_PROXY HTTPS_PROXY NO_PROXY http_proxy https_proxy no_proxy PIP_INDEX_URL PIP_EXTRA_INDEX_URL; do
    if [ -n "${!name:-}" ]; then clean_env+=("${name}=${!name}"); fi
done

# ── 3. Requirements (a failure stops the run) ─────────────────────────────────────────────────

if [ -n "${requirements:-}" ]; then
    if [ -f "${repo_copy}/${requirements}" ]; then
        echo "Installing ${requirements}"
        (cd "$repo_copy" && "${clean_env[@]}" python -m pip install --disable-pip-version-check \
            --root-user-action=ignore --no-cache-dir -r "$requirements") || fail "pip install -r ${requirements} failed; see ${output_dir}/run.log"
    else
        echo "No ${requirements} in the repository; nothing to install"
    fi
fi

# ── 4. PYTHONPATH and the first install candidate the repository has (not fatal) ───────────

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

# ── 5. The notebooks, in order, each in its own folder (the first failure stops the run) ────

echo "Notebooks: ${notebook_list[*]}"
for nb in "${notebook_list[@]}"; do
    [ -f "${repo_copy}/${nb}" ] || fail "${nb} is not in the repository"
    echo "Running ${nb}"
    mkdir -p "$(dirname "${results_dir}/${nb}")"
    (cd "$(dirname "${repo_copy}/${nb}")" && "${clean_env[@]}" python -m papermill --kernel python3 \
        --execution-timeout "$CELL_TIMEOUT_SECONDS" --cwd "$(dirname "${repo_copy}/${nb}")" "${repo_copy}/${nb}" "${results_dir}/${nb}") \
        || fail "${nb} failed; see ${output_dir}/${nb}"
done
echo "Done: ${output_dir}/"
