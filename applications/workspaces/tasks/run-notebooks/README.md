# run-notebooks

Argo task behind `POST /workspace/{id}/run`. Runs the notebooks it is given, with papermill, on the workspace volume.

It assumes nothing about the repository's layout: the caller sends every path, and setup paths the repository doesn't have are skipped.

## Inputs

Environment variables, set by `service/workflow.py` from the request. Paths are relative to the volume, or to `repo_dir` where noted, and must not contain `..`. Lists have one item per line; an input or output is `<from><tab><to>`.

| Variable | |
|---|---|
| `repo_dir` | The repository. |
| `notebooks` | Notebooks to run, in this order (repo-relative). |
| `executed_notebooks_dir` | Where the executed notebooks go. |
| `log_file` | Where the log goes. The run is refused if it already exists. |
| `discard_repo` | Optional. `true`: remove `repo_dir` from the volume once copied, so the next run imports it fresh. |
| `requirements` | Optional. Repo file passed to `pip install -r`. |
| `python_path` | Optional. Repo folders added to `PYTHONPATH`. |
| `install` | Optional. Candidates; the first that exists is used. `setup.py` / `pyproject.toml`: pip-install its folder. Any other `.py`: run it. |
| `inputs` | Optional. Volume path (file or folder) → repo folder, before the run. |
| `outputs` | Optional. Repo folder → volume folder, after the run. |

## Steps

1. Copy the repository to a scratch folder; the run works on the copy. With `discard_repo`, remove the repository from the volume.
2. Empty each `outputs` source, so results committed to the repository don't pass for the run's. Replace each `inputs` target with its source: a folder holding a single subfolder is unwrapped, and `__MACOSX/` and hidden files are skipped.
3. Install `requirements`. A failure stops the run.
4. Set `PYTHONPATH`, then run the install candidate. A failure there only logs a warning.
5. Run `notebooks` in order, each in its own folder. The first failure stops the run.

Steps 3–5 run with a clean environment: the repository's code doesn't see the task's own variables.

## Output

Owned by the notebook user (1000:100), so they can be changed from JupyterLab:

- `executed_notebooks_dir`: each executed notebook.
- each `outputs` target: what the code wrote, collected after a failure too.
- `log_file`: the full log.

On failure, the reason is in the step's message, which `GET /workspace/{id}/run/{workflow}` returns.
