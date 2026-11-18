# DandiValidateUploadRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**instance** | **str** | The DANDI deployment, by its dandi-cli name. | 
**username** | **str** | Keycloak user whose DANDI_API_KEY attribute signs the upload; the key must belong to that deployment. | 
**dandiset_id** | **str** |  | 
**upload_id** | **str** | Omitted when get_upload_urls returned a blob_id (nothing was uploaded). | [optional] 
**path** | **str** | The path get_upload_urls returned. | 
**parts** | [**List[DandiUploadedPart]**](DandiUploadedPart.md) | Omitted when get_upload_urls returned a blob_id. | [optional] 
**blob_id** | **str** | Echoed from get_upload_urls; when present, complete/validate are skipped. | [optional] 

## Example

```python
from osbv2_api.workspaces.models.dandi_validate_upload_request import DandiValidateUploadRequest

# TODO update the JSON string below
json = "{}"
# create an instance of DandiValidateUploadRequest from a JSON string
dandi_validate_upload_request_instance = DandiValidateUploadRequest.from_json(json)
# print the JSON string representation of the object
print(DandiValidateUploadRequest.to_json())

# convert the object into a dict
dandi_validate_upload_request_dict = dandi_validate_upload_request_instance.to_dict()
# create an instance of DandiValidateUploadRequest from a dict
dandi_validate_upload_request_from_dict = DandiValidateUploadRequest.from_dict(dandi_validate_upload_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


