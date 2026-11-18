# WorkspaceResourceBase


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

## Example

```python
from osbv2_api.workspaces.models.workspace_resource_base import WorkspaceResourceBase

# TODO update the JSON string below
json = "{}"
# create an instance of WorkspaceResourceBase from a JSON string
workspace_resource_base_instance = WorkspaceResourceBase.from_json(json)
# print the JSON string representation of the object
print(WorkspaceResourceBase.to_json())

# convert the object into a dict
workspace_resource_base_dict = workspace_resource_base_instance.to_dict()
# create an instance of WorkspaceResourceBase from a dict
workspace_resource_base_from_dict = WorkspaceResourceBase.from_dict(workspace_resource_base_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


