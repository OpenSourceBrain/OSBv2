# OsbrepositoryGet200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**pagination** | [**Pagination**](Pagination.md) |  | [optional] 
**osbrepositories** | [**List[OSBRepository]**](OSBRepository.md) |  | [optional] 

## Example

```python
from osbv2_api.workspaces.models.osbrepository_get200_response import OsbrepositoryGet200Response

# TODO update the JSON string below
json = "{}"
# create an instance of OsbrepositoryGet200Response from a JSON string
osbrepository_get200_response_instance = OsbrepositoryGet200Response.from_json(json)
# print the JSON string representation of the object
print(OsbrepositoryGet200Response.to_json())

# convert the object into a dict
osbrepository_get200_response_dict = osbrepository_get200_response_instance.to_dict()
# create an instance of OsbrepositoryGet200Response from a dict
osbrepository_get200_response_from_dict = OsbrepositoryGet200Response.from_dict(osbrepository_get200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


