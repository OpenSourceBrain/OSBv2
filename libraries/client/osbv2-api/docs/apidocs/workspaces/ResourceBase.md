# ResourceBase

Resource Base

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | file name | [optional] 
**path** | **str** | Download URL of the Resource | [optional] 

## Example

```python
from osbv2_api.workspaces.models.resource_base import ResourceBase

# TODO update the JSON string below
json = "{}"
# create an instance of ResourceBase from a JSON string
resource_base_instance = ResourceBase.from_json(json)
# print the JSON string representation of the object
print(ResourceBase.to_json())

# convert the object into a dict
resource_base_dict = resource_base_instance.to_dict()
# create an instance of ResourceBase from a dict
resource_base_from_dict = ResourceBase.from_dict(resource_base_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


