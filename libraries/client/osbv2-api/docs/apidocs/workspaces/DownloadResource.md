# DownloadResource

Download Resource (files/folders)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | file name | [optional] 
**path** | **str** | Download URL of the Resource | [optional] 

## Example

```python
from osbv2_api.workspaces.models.download_resource import DownloadResource

# TODO update the JSON string below
json = "{}"
# create an instance of DownloadResource from a JSON string
download_resource_instance = DownloadResource.from_json(json)
# print the JSON string representation of the object
print(DownloadResource.to_json())

# convert the object into a dict
download_resource_dict = download_resource_instance.to_dict()
# create an instance of DownloadResource from a dict
download_resource_from_dict = DownloadResource.from_dict(download_resource_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


