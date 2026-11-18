# RepositoryResource

Repository resource

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | file name | [optional] 
**path** | **str** | Download URL of the Resource | [optional] 
**osbrepository_id** | **int** | OSB Repository id | [optional] 
**size** | **int** | File size in bytes of the RepositoryResource | [optional] 
**timestamp_modified** | **datetime** | Date/time the ReposityResource is last modified | [optional] 
**ref** | **str** | The GIT ref | [optional] 
**sha** | **str** | The GIT sha of the resource | [optional] 

## Example

```python
from osbv2_api.workspaces.models.repository_resource import RepositoryResource

# TODO update the JSON string below
json = "{}"
# create an instance of RepositoryResource from a JSON string
repository_resource_instance = RepositoryResource.from_json(json)
# print the JSON string representation of the object
print(RepositoryResource.to_json())

# convert the object into a dict
repository_resource_dict = repository_resource_instance.to_dict()
# create an instance of RepositoryResource from a dict
repository_resource_from_dict = RepositoryResource.from_dict(repository_resource_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


