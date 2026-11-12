# VolumestorageGet200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**pagination** | [**Pagination**](Pagination.md) |  | [optional] 
**volumestorages** | [**List[VolumeStorage]**](VolumeStorage.md) |  | [optional] 

## Example

```python
from osbv2_api.workspaces.models.volumestorage_get200_response import VolumestorageGet200Response

# TODO update the JSON string below
json = "{}"
# create an instance of VolumestorageGet200Response from a JSON string
volumestorage_get200_response_instance = VolumestorageGet200Response.from_json(json)
# print the JSON string representation of the object
print(VolumestorageGet200Response.to_json())

# convert the object into a dict
volumestorage_get200_response_dict = volumestorage_get200_response_instance.to_dict()
# create an instance of VolumestorageGet200Response from a dict
volumestorage_get200_response_from_dict = VolumestorageGet200Response.from_dict(volumestorage_get200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


