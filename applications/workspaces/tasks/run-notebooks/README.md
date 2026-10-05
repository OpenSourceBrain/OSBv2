# run-notebooks

Argo task behind `POST /workspace/{id}/run`. Runs the notebooks it is given, with papermill, on the workspace volume.

It assumes nothing about the repository's layout: the caller sends every path, and setup paths the repository doesn't have are skipped.

## Inputs

Environment variables, set by `service/workflow.py` from the request. Paths are relative to the volume, or to `repo_dir` where noted, and must not contain `..`. Lists have one item per line.

| Variable | |
|---|---|
| `repo_dir` | The repository. |
| `notebooks` | Notebooks to run, in this order (repo-relative). |
| `executed_notebooks_dir` | Where the executed notebooks go if the run succeeds (see Output). |
| `log_file` | Where the log goes. The run is refused if it already exists. |
| `discard_repo` | Optional. `true`: remove `repo_dir` from the volume once copied, so the next run imports it fresh. |
| `requirements` | Optional. Repo file passed to `pip install -r`. |
| `python_path` | Optional. Repo folders added to `PYTHONPATH`. |
| `install` | Optional. Candidates; the first that exists is used. `setup.py` / `pyproject.toml`: pip-install its folder. Any other `.py`: run it. |
| `input_dir` | Optional. Passed to the notebooks as their `INPUT_DIR` parameter. |
| `output_dir` | Passed to the notebooks as their `OUTPUT_DIR` parameter. |

## Steps

1. Copy the repository to a scratch folder; the run works on the copy. With `discard_repo`, remove the repository from the volume.
2. Install `requirements`. A failure stops the run.
3. Set `PYTHONPATH`, then run the install candidate. A failure there only logs a warning.
4. Run `notebooks` in order, each in its own folder, with `INPUT_DIR` and `OUTPUT_DIR` as papermill parameters. A notebook without a cell tagged `parameters` isn't run. The first failure stops the run.

Steps 2–4 run with a clean environment: the repository's code doesn't see the task's own variables.

## Notebook contract

Each notebook has a code cell tagged `parameters` that sets `INPUT_DIR` and `OUTPUT_DIR` to its own defaults (e.g. its example data). The notebooks read from `INPUT_DIR` and write everything they produce to `OUTPUT_DIR`.

## Output

Owned by the notebook user (1000:100), so they can be changed from JupyterLab:

- `executed_notebooks_dir`: each executed notebook, only if every notebook passed. They are written to `<executed_notebooks_dir>.running` during the run, and the folder is renamed on exit: to `executed_notebooks_dir` on success, or to `<executed_notebooks_dir>.failed` if a notebook failed (it holds the ones that ran, the failed one last). So `executed_notebooks_dir` existing means the whole run succeeded.
- `output_dir`: what the notebooks wrote.
- `log_file`: the full log.

On failure, the reason is at the end of the log, and in the Argo step's message.

The workflow's workspace scan is its exit handler (`service/workflow.py`), so it runs however the task ended (failed, or its pod killed, included): the workspace then lists `executed_notebooks_dir` or `<executed_notebooks_dir>.failed`, and the Argo phase stays the task's own.
