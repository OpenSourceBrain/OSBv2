# DandiUploadPart


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**part_number** | **int** |  | [optional] 
**url** | **str** | Presigned S3 URL the client PUTs this part&#39;s bytes to directly. | [optional] 

## Example

```python
from osbv2_api.workspaces.models.dandi_upload_part import DandiUploadPart

# TODO update the JSON string below
json = "{}"
# create an instance of DandiUploadPart from a JSON string
dandi_upload_part_instance = DandiUploadPart.from_json(json)
# print the JSON string representation of the object
print(DandiUploadPart.to_json())

# convert the object into a dict
dandi_upload_part_dict = dandi_upload_part_instance.to_dict()
# create an instance of DandiUploadPart from a dict
dandi_upload_part_from_dict = DandiUploadPart.from_dict(dandi_upload_part_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


