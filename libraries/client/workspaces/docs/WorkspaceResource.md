# WorkspaceResource

Workspace Resource item of a Workspace

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | WorkspaceResource name | 
**resource_type** | [**ResourceType**](ResourceType.md) |  | 
**id** | **int** |  | [optional] 
**folder** | **str** | WorkspaceResource folder where the resource will stored in the pvc | [optional] 
**status** | [**ResourceStatus**](ResourceStatus.md) |  | [optional] 
**timestamp_created** | **datetime** | Date/time of creation of the WorkspaceResource | [optional] 
**timestamp_updated** | **datetime** | Date/time of last updating of the WorkspaceResource | [optional] 
**timestamp_last_opened** | **datetime** | Date/time of last opening of the WorkspaceResource | [optional] 
**workspace_id** | **int** | workspace_id | [optional] 
**origin** | [**ResourceOrigin**](ResourceOrigin.md) |  | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


