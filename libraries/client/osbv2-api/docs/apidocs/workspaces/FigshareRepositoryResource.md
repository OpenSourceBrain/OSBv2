# FigshareRepositoryResource

figshare repository resource

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
from osbv2_api.workspaces.models.figshare_repository_resource import FigshareRepositoryResource

# TODO update the JSON string below
json = "{}"
# create an instance of FigshareRepositoryResource from a JSON string
figshare_repository_resource_instance = FigshareRepositoryResource.from_json(json)
# print the JSON string representation of the object
print(FigshareRepositoryResource.to_json())

# convert the object into a dict
figshare_repository_resource_dict = figshare_repository_resource_instance.to_dict()
# create an instance of FigshareRepositoryResource from a dict
figshare_repository_resource_from_dict = FigshareRepositoryResource.from_dict(figshare_repository_resource_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


