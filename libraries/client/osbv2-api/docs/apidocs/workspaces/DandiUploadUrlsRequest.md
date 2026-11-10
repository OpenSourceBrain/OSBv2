# DandiUploadUrlsRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**instance** | **str** | The DANDI deployment, by its dandi-cli name. | 
**username** | **str** | Keycloak user whose DANDI_API_KEY attribute signs the upload; the key must belong to that deployment. | 
**dandiset_id** | **str** | The dandiset to upload into, chosen by the client. | 
**filename** | **str** |  | 
**size** | **int** |  | 
**dandi_etag** | **str** | S3-multipart digest in DANDI&#39;s format (32 hex chars, a dash, the part count), computed by the client since the bytes never reach this server. | 

## Example

```python
from osbv2_api.workspaces.models.dandi_upload_urls_request import DandiUploadUrlsRequest

# TODO update the JSON string below
json = "{}"
# create an instance of DandiUploadUrlsRequest from a JSON string
dandi_upload_urls_request_instance = DandiUploadUrlsRequest.from_json(json)
# print the JSON string representation of the object
print(DandiUploadUrlsRequest.to_json())

# convert the object into a dict
dandi_upload_urls_request_dict = dandi_upload_urls_request_instance.to_dict()
# create an instance of DandiUploadUrlsRequest from a dict
dandi_upload_urls_request_from_dict = DandiUploadUrlsRequest.from_dict(dandi_upload_urls_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


