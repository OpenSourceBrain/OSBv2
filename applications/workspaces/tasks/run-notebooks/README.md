# run-notebooks

Argo task behind `POST /workspace/{id}/run`. Runs the notebooks it is given, with papermill, on the workspace volume.

It assumes nothing about the repository's layout: the caller sends every path, and setup paths the repository doesn't have are skipped.

## Inputs

Environment variables. Paths are relative to the volume, or to `repo_dir` where noted, and must not contain `..`. Lists have one path per line.

| Variable | |
|---|---|
| `repo_dir` | The repository. |
| `notebooks` | Notebooks to run, in this order (repo-relative). |
| `output_dir` | This run's results folder. The API generates it as `<output_dir>/run-<name>-<UTC timestamp>`, so each run gets its own folder. It must not exist yet. |
| `input_path` | Optional. The data, as a file or a folder. |
| `input_dir` | Required with `input_path`. Repo folder the data is put in. |
| `outputs` | Optional. Repo folders copied to the results. |
| `requirements` | Optional. Repo file passed to `pip install -r`. |
| `python_path` | Optional. Repo folders added to `PYTHONPATH`. |
| `install` | Optional. Candidates; the first that exists is used. `setup.py` / `pyproject.toml`: pip-install its folder. Any other `.py`: run it. |

## Steps

1. Copy the repository to a scratch folder. The repository on the volume is never changed.
2. Empty the `outputs` folders, so results committed to the repository don't pass for the run's. Replace `input_dir` with the data: a folder holding a single subfolder is unwrapped, and `__MACOSX/` and hidden files are skipped.
3. Install `requirements`. A failure stops the run.
4. Set `PYTHONPATH`, then run the install candidate. A failure there only logs a warning.
5. Run `notebooks` in order, each in its own folder. The first failure stops the run.

Steps 3–5 run with a clean environment: the repository's code doesn't see the task's own variables.

## Output

In `output_dir`, owned by the notebook user (1000:100) so it can be changed from JupyterLab:

- `run.log`: the full log.
- `<notebook>`: each executed notebook.
- `<outputs folder>/`: each `outputs` folder, collected after a failure too.

On failure, the reason is in the step's message, which `GET /workspace/{id}/run/{workflow}` returns.
