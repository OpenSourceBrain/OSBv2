# Workspace

Workspace extended

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | [optional] 
**name** | **str** | Workspace name. | 
**description** | **str** | Workspace description. | 
**timestamp_created** | **datetime** | Date/time the Workspace is created | [optional] 
**timestamp_updated** | **datetime** | Date/time the Workspace is last updated | [optional] 
**last_opened_resource_id** | **int** | The workspace resource id the workspace is opened last with | [optional] 
**thumbnail** | **str** |  | [optional] 
**gallery** | [**List[WorkspaceImage]**](WorkspaceImage.md) | Gallery with images of the workspace | [optional] 
**user_id** | **str** | Workspace keycloak user id, will be automatically be set to the logged in user | [optional] 
**publicable** | **bool** | Is this a public workspace? Default false | [optional] [default to False]
**featured** | **bool** | Is this a featured workspace? Default false | [optional] [default to False]
**license** | **str** | Workspace license | [optional] 
**collaborators** | [**List[WorkspaceCollaborator]**](WorkspaceCollaborator.md) | Collaborators who work on the workspace | [optional] 
**storage** | [**VolumeStorage**](VolumeStorage.md) |  | [optional] 
**tags** | [**List[Tag]**](Tag.md) |  | [optional] 
**resources** | [**List[WorkspaceResource]**](WorkspaceResource.md) | Resources of the workspace | [optional] 
**user** | [**User**](User.md) |  | [optional] 

## Example

```python
from osbv2_api.workspaces.models.workspace import Workspace

# TODO update the JSON string below
json = "{}"
# create an instance of Workspace from a JSON string
workspace_instance = Workspace.from_json(json)
# print the JSON string representation of the object
print(Workspace.to_json())

# convert the object into a dict
workspace_dict = workspace_instance.to_dict()
# create an instance of Workspace from a dict
workspace_from_dict = Workspace.from_dict(workspace_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


