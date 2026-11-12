# VolumeStorage

Volume which can be connected to a workspace

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | [optional] 
**name** | **str** | StorageVolume name | 

## Example

```python
from osbv2_api.workspaces.models.volume_storage import VolumeStorage

# TODO update the JSON string below
json = "{}"
# create an instance of VolumeStorage from a JSON string
volume_storage_instance = VolumeStorage.from_json(json)
# print the JSON string representation of the object
print(VolumeStorage.to_json())

# convert the object into a dict
volume_storage_dict = volume_storage_instance.to_dict()
# create an instance of VolumeStorage from a dict
volume_storage_from_dict = VolumeStorage.from_dict(volume_storage_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


