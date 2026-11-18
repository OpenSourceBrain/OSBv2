# WorkspaceCollaborator

Workspace Collaborator of a workspace

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | [optional] 
**user_id** | **str** | Workspace Collaborator keycloak user id | 

## Example

```python
from osbv2_api.workspaces.models.workspace_collaborator import WorkspaceCollaborator

# TODO update the JSON string below
json = "{}"
# create an instance of WorkspaceCollaborator from a JSON string
workspace_collaborator_instance = WorkspaceCollaborator.from_json(json)
# print the JSON string representation of the object
print(WorkspaceCollaborator.to_json())

# convert the object into a dict
workspace_collaborator_dict = workspace_collaborator_instance.to_dict()
# create an instance of WorkspaceCollaborator from a dict
workspace_collaborator_from_dict = WorkspaceCollaborator.from_dict(workspace_collaborator_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


