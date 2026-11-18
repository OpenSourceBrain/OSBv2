# WorkspaceRunResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**workflow** | **str** | The run&#39;s Argo workflow name. | 

## Example

```python
from osbv2_api.workspaces.models.workspace_run_response import WorkspaceRunResponse

# TODO update the JSON string below
json = "{}"
# create an instance of WorkspaceRunResponse from a JSON string
workspace_run_response_instance = WorkspaceRunResponse.from_json(json)
# print the JSON string representation of the object
print(WorkspaceRunResponse.to_json())

# convert the object into a dict
workspace_run_response_dict = workspace_run_response_instance.to_dict()
# create an instance of WorkspaceRunResponse from a dict
workspace_run_response_from_dict = WorkspaceRunResponse.from_dict(workspace_run_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


