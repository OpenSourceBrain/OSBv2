# DandiUploadUrlsResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**dandiset_id** | **str** |  | 
**upload_id** | **str** | Absent when the deployment already held this content. | [optional] 
**path** | **str** | Asset path, built by OSB from the caller&#39;s id. | 
**parts** | [**List[DandiUploadPart]**](DandiUploadPart.md) |  | 
**blob_id** | **str** | Set only when the deployment already held this content (parts is then empty). | [optional] 

## Example

```python
from osbv2_api.workspaces.models.dandi_upload_urls_response import DandiUploadUrlsResponse

# TODO update the JSON string below
json = "{}"
# create an instance of DandiUploadUrlsResponse from a JSON string
dandi_upload_urls_response_instance = DandiUploadUrlsResponse.from_json(json)
# print the JSON string representation of the object
print(DandiUploadUrlsResponse.to_json())

# convert the object into a dict
dandi_upload_urls_response_dict = dandi_upload_urls_response_instance.to_dict()
# create an instance of DandiUploadUrlsResponse from a dict
dandi_upload_urls_response_from_dict = DandiUploadUrlsResponse.from_dict(dandi_upload_urls_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


