# DandiRepositoryResource

dandi repository resource

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
from osbv2_api.workspaces.models.dandi_repository_resource import DandiRepositoryResource

# TODO update the JSON string below
json = "{}"
# create an instance of DandiRepositoryResource from a JSON string
dandi_repository_resource_instance = DandiRepositoryResource.from_json(json)
# print the JSON string representation of the object
print(DandiRepositoryResource.to_json())

# convert the object into a dict
dandi_repository_resource_dict = dandi_repository_resource_instance.to_dict()
# create an instance of DandiRepositoryResource from a dict
dandi_repository_resource_from_dict = DandiRepositoryResource.from_dict(dandi_repository_resource_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


