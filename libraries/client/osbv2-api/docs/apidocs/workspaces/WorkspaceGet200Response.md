# WorkspaceGet200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**pagination** | [**Pagination**](Pagination.md) |  | [optional] 
**workspaces** | [**List[Workspace]**](Workspace.md) |  | [optional] 

## Example

```python
from osbv2_api.workspaces.models.workspace_get200_response import WorkspaceGet200Response

# TODO update the JSON string below
json = "{}"
# create an instance of WorkspaceGet200Response from a JSON string
workspace_get200_response_instance = WorkspaceGet200Response.from_json(json)
# print the JSON string representation of the object
print(WorkspaceGet200Response.to_json())

# convert the object into a dict
workspace_get200_response_dict = workspace_get200_response_instance.to_dict()
# create an instance of WorkspaceGet200Response from a dict
workspace_get200_response_from_dict = WorkspaceGet200Response.from_dict(workspace_get200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


