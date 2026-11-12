# WorkspaceRunRequest

What to run, how to set it up, and where its files go. All paths are relative.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**repo** | [**WorkspaceRunRepo**](WorkspaceRunRepo.md) |  | 
**setup** | [**WorkspaceRunSetup**](WorkspaceRunSetup.md) |  | [optional] 
**notebooks** | **List[str]** | The notebooks to run, relative to repo.dir, in this order. Each runs in its own folder in the project (see repo.dir); the run stops at the first that fails. | 
**input_dir** | **str** | The run&#39;s input on the volume, passed to the notebooks as their INPUT_DIR parameter, relative to the notebook&#39;s folder. Without it they use their own default (e.g. example data). | [optional] 
**output_dir** | **str** | Where the notebooks write their results on the volume, passed to them as their OUTPUT_DIR parameter, relative to the notebook&#39;s folder. | 
**results** | [**WorkspaceRunResults**](WorkspaceRunResults.md) |  | 
**image** | **str** | The image to run the notebooks in: an OSB workspace application (e.g. netpyne) or an image from a trusted registry. Defaults to OSB&#39;s JupyterLab. | [optional] 

## Example

```python
from osbv2_api.workspaces.models.workspace_run_request import WorkspaceRunRequest

# TODO update the JSON string below
json = "{}"
# create an instance of WorkspaceRunRequest from a JSON string
workspace_run_request_instance = WorkspaceRunRequest.from_json(json)
# print the JSON string representation of the object
print(WorkspaceRunRequest.to_json())

# convert the object into a dict
workspace_run_request_dict = workspace_run_request_instance.to_dict()
# create an instance of WorkspaceRunRequest from a dict
workspace_run_request_from_dict = WorkspaceRunRequest.from_dict(workspace_run_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


