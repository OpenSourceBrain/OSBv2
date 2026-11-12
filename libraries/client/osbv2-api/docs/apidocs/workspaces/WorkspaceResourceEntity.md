# WorkspaceResourceEntity

Workspace Resource item of a Workspace

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | [optional] 
**name** | **str** | WorkspaceResource name | 
**status** | [**ResourceStatus**](ResourceStatus.md) |  | [optional] [default to ResourceStatus.P]
**timestamp_created** | **datetime** | Date/time of creation of the WorkspaceResource | [optional] 
**timestamp_updated** | **datetime** | Date/time of last updating of the WorkspaceResource | [optional] 
**timestamp_last_opened** | **datetime** | Date/time of last opening of the WorkspaceResource | [optional] 
**resource_type** | [**ResourceType**](ResourceType.md) |  | [default to ResourceType.G]
**origin** | **str** | Origin data JSON formatted of the WorkspaceResource | [optional] 
**workspace_id** | **int** | workspace_id | [optional] 
**folder** | **str** | WorkspaceResource path where the resource will stored in the pvc. | [optional] 

## Example

```python
from osbv2_api.workspaces.models.workspace_resource_entity import WorkspaceResourceEntity

# TODO update the JSON string below
json = "{}"
# create an instance of WorkspaceResourceEntity from a JSON string
workspace_resource_entity_instance = WorkspaceResourceEntity.from_json(json)
# print the JSON string representation of the object
print(WorkspaceResourceEntity.to_json())

# convert the object into a dict
workspace_resource_entity_dict = workspace_resource_entity_instance.to_dict()
# create an instance of WorkspaceResourceEntity from a dict
workspace_resource_entity_from_dict = WorkspaceResourceEntity.from_dict(workspace_resource_entity_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


