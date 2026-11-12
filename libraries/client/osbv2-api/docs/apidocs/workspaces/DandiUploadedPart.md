# DandiUploadedPart


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**part_number** | **int** |  | [optional] 
**size** | **int** |  | [optional] 
**etag** | **str** | The ETag S3 returned for this part&#39;s PUT. | [optional] 

## Example

```python
from osbv2_api.workspaces.models.dandi_uploaded_part import DandiUploadedPart

# TODO update the JSON string below
json = "{}"
# create an instance of DandiUploadedPart from a JSON string
dandi_uploaded_part_instance = DandiUploadedPart.from_json(json)
# print the JSON string representation of the object
print(DandiUploadedPart.to_json())

# convert the object into a dict
dandi_uploaded_part_dict = dandi_uploaded_part_instance.to_dict()
# create an instance of DandiUploadedPart from a dict
dandi_uploaded_part_from_dict = DandiUploadedPart.from_dict(dandi_uploaded_part_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


