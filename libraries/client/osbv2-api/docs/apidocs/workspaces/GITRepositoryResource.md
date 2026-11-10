# GITRepositoryResource

github repository resource

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
from osbv2_api.workspaces.models.git_repository_resource import GITRepositoryResource

# TODO update the JSON string below
json = "{}"
# create an instance of GITRepositoryResource from a JSON string
git_repository_resource_instance = GITRepositoryResource.from_json(json)
# print the JSON string representation of the object
print(GITRepositoryResource.to_json())

# convert the object into a dict
git_repository_resource_dict = git_repository_resource_instance.to_dict()
# create an instance of GITRepositoryResource from a dict
git_repository_resource_from_dict = GITRepositoryResource.from_dict(git_repository_resource_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


