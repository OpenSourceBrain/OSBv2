# ResourceOrigin

optional Resource where the WorkspaceResource is build from

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
from osbv2_api.workspaces.models.resource_origin import ResourceOrigin

# TODO update the JSON string below
json = "{}"
# create an instance of ResourceOrigin from a JSON string
resource_origin_instance = ResourceOrigin.from_json(json)
# print the JSON string representation of the object
print(ResourceOrigin.to_json())

# convert the object into a dict
resource_origin_dict = resource_origin_instance.to_dict()
# create an instance of ResourceOrigin from a dict
resource_origin_from_dict = ResourceOrigin.from_dict(resource_origin_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


