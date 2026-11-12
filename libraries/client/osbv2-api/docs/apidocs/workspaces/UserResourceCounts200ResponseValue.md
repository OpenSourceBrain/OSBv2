# UserResourceCounts200ResponseValue


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**workspaces** | **int** |  | [optional] 
**repositories** | **int** |  | [optional] 

## Example

```python
from osbv2_api.workspaces.models.user_resource_counts200_response_value import UserResourceCounts200ResponseValue

# TODO update the JSON string below
json = "{}"
# create an instance of UserResourceCounts200ResponseValue from a JSON string
user_resource_counts200_response_value_instance = UserResourceCounts200ResponseValue.from_json(json)
# print the JSON string representation of the object
print(UserResourceCounts200ResponseValue.to_json())

# convert the object into a dict
user_resource_counts200_response_value_dict = user_resource_counts200_response_value_instance.to_dict()
# create an instance of UserResourceCounts200ResponseValue from a dict
user_resource_counts200_response_value_from_dict = UserResourceCounts200ResponseValue.from_dict(user_resource_counts200_response_value_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


