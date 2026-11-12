# RepositoryResourceBase

Resource (files/folders) of an OSBRepository

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | file name | [optional] 
**path** | **str** | Download URL of the Resource | [optional] 
**osbrepository_id** | **int** | OSB Repository id | [optional] 
**size** | **int** | File size in bytes of the RepositoryResource | [optional] 
**timestamp_modified** | **datetime** | Date/time the ReposityResource is last modified | [optional] 

## Example

```python
from osbv2_api.workspaces.models.repository_resource_base import RepositoryResourceBase

# TODO update the JSON string below
json = "{}"
# create an instance of RepositoryResourceBase from a JSON string
repository_resource_base_instance = RepositoryResourceBase.from_json(json)
# print the JSON string representation of the object
print(RepositoryResourceBase.to_json())

# convert the object into a dict
repository_resource_base_dict = repository_resource_base_instance.to_dict()
# create an instance of RepositoryResourceBase from a dict
repository_resource_base_from_dict = RepositoryResourceBase.from_dict(repository_resource_base_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


