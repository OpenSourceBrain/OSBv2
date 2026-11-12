# OSBRepositoryEntity

OSB Repository model

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | [optional] 
**name** | **str** | Repository name. | 
**summary** | **str** | Summary describing the OSB Repository | [optional] 
**repository_type** | [**RepositoryType**](RepositoryType.md) |  | 
**content_types** | **str** | List of Repository Content Types | 
**auto_sync** | **bool** | Auto sync of the resources | [optional] [default to True]
**uri** | **str** | URI of the repository | 
**default_context** | **str** | The default branch to show for this repository | [optional] 
**thumbnail** | **str** |  | [optional] 
**user_id** | **str** | OSBRepository keycloak user id, will be automatically be set to the logged in user | [optional] 
**timestamp_created** | **datetime** | Date/time the Workspace is created | [optional] 
**timestamp_updated** | **datetime** | Date/time the Workspace is last updated | [optional] 
**tags** | [**List[Tag]**](Tag.md) |  | [optional] 

## Example

```python
from osbv2_api.workspaces.models.osb_repository_entity import OSBRepositoryEntity

# TODO update the JSON string below
json = "{}"
# create an instance of OSBRepositoryEntity from a JSON string
osb_repository_entity_instance = OSBRepositoryEntity.from_json(json)
# print the JSON string representation of the object
print(OSBRepositoryEntity.to_json())

# convert the object into a dict
osb_repository_entity_dict = osb_repository_entity_instance.to_dict()
# create an instance of OSBRepositoryEntity from a dict
osb_repository_entity_from_dict = OSBRepositoryEntity.from_dict(osb_repository_entity_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


