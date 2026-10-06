# run-notebooks

Argo task behind `POST /workspace/{id}/run`. Runs the notebooks it is given, with papermill, on the workspace volume.

`run.sh` isn't built into an image. It is the `run-notebooks` script of `run_notebooks.scripts` in `deploy/values.yaml`, mounted from the `workspaces-run-notebooks` ConfigMap (`deploy/templates/run-notebook-configmap.yaml`) when the request names it (`script`, required). The run's pod uses OSB's JupyterLab image (`jupyterlab-minimal` in a deployment without it, e.g. a local one), which gives the notebooks their environment. The image needs `bash` and `python`; papermill and ipykernel are installed if it hasn't them.

It assumes nothing about the repository's layout: the caller sends every path, and setup paths the repository doesn't have are skipped.

## Inputs

Environment variables, set by `service/workflow.py` from the request. Paths are relative to the volume (set-up paths to the repository's root), already checked by the controller. Lists have one item per line.

| Variables | |
|---|---|
| `repo_dir` | The repository, as imported. Left as it is. |
| `project_dir` | Where the run works: the folder `repo_dir` was imported into (the run's folder; set by the server, not the request). The repository's files are copied there, and the notebooks run from there. |
| `notebooks` | The notebooks to run, in this order, relative to `repo_dir`. |
| `input_dir`, `output_dir` | Passed to the notebooks as their `INPUT_DIR` and `OUTPUT_DIR` parameters, relative to the notebook's folder. `input_dir` is optional: without it the notebooks use their own default. |
| `requirements`, `python_path`, `install` | Optional set-up: a requirements file for `pip install -r`; folders added to `PYTHONPATH`; install candidates, the first that exists is used (`setup.py` / `pyproject.toml`: pip-install its folder; any other `.py`: run it). |
| `executed_notebooks_dir`, `log_file` | Where the executed notebooks (see Output) and the log go. The run is refused if either already exists. |

## Steps

1. Copy the repository's files into `project_dir`, except names it already has (e.g. the run's `inputs/` and `outputs/`; logged) and the executed notebooks' folder, which the executed notebooks fill.
2. Install papermill and ipykernel if the image hasn't them, then `requirements`. A failure stops the run.
3. Set `PYTHONPATH`, then run the install candidate. A failure there only logs a warning.
4. Run `notebooks` in order, each from its own folder in `project_dir` (as it sits in the repository), with `INPUT_DIR` and `OUTPUT_DIR` as papermill parameters, relative to that folder. A notebook without a cell tagged `parameters` isn't run. The first failure stops the run.

Steps 2–4 run with a clean environment: the repository's code doesn't see the task's own variables.

## Notebook contract

Each notebook has a code cell tagged `parameters` that sets `INPUT_DIR` and `OUTPUT_DIR` to its own defaults (e.g. its example data). The notebooks read from `INPUT_DIR` and write everything they produce to `OUTPUT_DIR`. They find the repository's own code relative to their own folder (e.g. `Path.cwd()`), as the run and JupyterLab both run a notebook from its folder.

## Output

- `executed_notebooks_dir`: each executed notebook, only if every notebook passed. They are written to `<executed_notebooks_dir>.running` during the run, and on exit they go to `executed_notebooks_dir` on success, or the folder becomes `<executed_notebooks_dir>.failed` if a notebook failed (it holds the ones that ran, the failed one last). So notebooks listed in `executed_notebooks_dir` mean the whole run succeeded.
- `project_dir`: the repository's files. When `executed_notebooks_dir` is the notebooks' own folder there (e.g. `<project_dir>/notebooks`), the executed notebooks take the originals' place, and can be run again from there in JupyterLab: their code is next to them as in the repository, and their `INPUT_DIR` and `OUTPUT_DIR` are relative.
- `output_dir`: what the notebooks wrote.
- `log_file`: the full log.

On failure, the reason is at the end of the log, and in the Argo step's message.

The workflow's workspace scan is its exit handler (`service/workflow.py`), so it runs however the task ended (failed, or its pod killed, included): the workspace then lists `executed_notebooks_dir` or `<executed_notebooks_dir>.failed`, and the Argo phase stays the task's own. The scan also hands everything on the volume to the notebook user (1000:100), so the results can be changed from JupyterLab.
