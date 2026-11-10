# WorkspaceRunRepo

The repository the notebooks are in.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**dir** | **str** | The repository on the volume, as imported, inside the run&#39;s folder (e.g. the zip&#39;s &lt;repo&gt;-&lt;ref&gt;/). That folder is the notebooks&#39; project: the run copies the repository&#39;s files there, except names it already has (e.g. the input and output folders), and runs the notebooks from there as they would from the repository, so their executed copies can be run again in JupyterLab. The repository is left as it is. | 

## Example

```python
from osbv2_api.workspaces.models.workspace_run_repo import WorkspaceRunRepo

# TODO update the JSON string below
json = "{}"
# create an instance of WorkspaceRunRepo from a JSON string
workspace_run_repo_instance = WorkspaceRunRepo.from_json(json)
# print the JSON string representation of the object
print(WorkspaceRunRepo.to_json())

# convert the object into a dict
workspace_run_repo_dict = workspace_run_repo_instance.to_dict()
# create an instance of WorkspaceRunRepo from a dict
workspace_run_repo_from_dict = WorkspaceRunRepo.from_dict(workspace_run_repo_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


