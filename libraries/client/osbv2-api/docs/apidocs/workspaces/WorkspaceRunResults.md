# WorkspaceRunResults

Where the run task's own products go on the volume.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**notebooks** | **str** | Folder for the executed notebooks, created only if every notebook passes; if one fails, they are in &lt;folder&gt;.failed instead. To run them again in JupyterLab, it is their own folder in the project (e.g. &lt;run folder&gt;/notebooks): they replace the originals there. | 
**log** | **str** | The run&#39;s log file. The run is refused if it already exists. | 

## Example

```python
from osbv2_api.workspaces.models.workspace_run_results import WorkspaceRunResults

# TODO update the JSON string below
json = "{}"
# create an instance of WorkspaceRunResults from a JSON string
workspace_run_results_instance = WorkspaceRunResults.from_json(json)
# print the JSON string representation of the object
print(WorkspaceRunResults.to_json())

# convert the object into a dict
workspace_run_results_dict = workspace_run_results_instance.to_dict()
# create an instance of WorkspaceRunResults from a dict
workspace_run_results_from_dict = WorkspaceRunResults.from_dict(workspace_run_results_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


