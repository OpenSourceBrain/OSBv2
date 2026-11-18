# DandiValidateUploadResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**asset_id** | **str** |  | 
**asset_path** | **str** |  | 
**dandiset_id** | **str** |  | [optional] 
**download_url** | **str** | Where the asset&#39;s bytes can be fetched from, e.g. by OSB&#39;s workspace import. | 

## Example

```python
from osbv2_api.workspaces.models.dandi_validate_upload_response import DandiValidateUploadResponse

# TODO update the JSON string below
json = "{}"
# create an instance of DandiValidateUploadResponse from a JSON string
dandi_validate_upload_response_instance = DandiValidateUploadResponse.from_json(json)
# print the JSON string representation of the object
print(DandiValidateUploadResponse.to_json())

# convert the object into a dict
dandi_validate_upload_response_dict = dandi_validate_upload_response_instance.to_dict()
# create an instance of DandiValidateUploadResponse from a dict
dandi_validate_upload_response_from_dict = DandiValidateUploadResponse.from_dict(dandi_validate_upload_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


