# Workspace

Workspace extended

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | Workspace name. | 
**description** | **str** | Workspace description. | 
**id** | **int** |  | [optional] 
**timestamp_created** | **datetime** | Date/time the Workspace is created | [optional] 
**timestamp_updated** | **datetime** | Date/time the Workspace is last updated | [optional] 
**last_opened_resource_id** | **int** | The workspace resource id the workspace is opened last with | [optional] 
**thumbnail** | **str** |  | [optional] 
**gallery** | **[dict]** | Gallery with images of the workspace | [optional] 
**user_id** | **str** | Workspace keycloak user id, will be automatically be set to the logged in user | [optional] 
**publicable** | **bool** | Is this a public workspace? Default false | [optional]  if omitted the server will use the default value of False
**featured** | **bool** | Is this a featured workspace? Default false | [optional]  if omitted the server will use the default value of False
**license** | **str** | Workspace license | [optional] 
**collaborators** | [**[WorkspaceCollaborator]**](WorkspaceCollaborator.md) | Collaborators who work on the workspace | [optional] 
**storage** | [**VolumeStorage**](VolumeStorage.md) |  | [optional] 
**tags** | **[dict]** |  | [optional] 
**resources** | [**[WorkspaceResource]**](WorkspaceResource.md) | Resources of the workspace | [optional] 
**user** | [**User**](User.md) |  | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


