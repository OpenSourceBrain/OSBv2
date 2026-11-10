# User

Keycloak User

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Keycloak user id | [optional] 
**first_name** | **str** | First Name of the keycloak user | [optional] 
**last_name** | **str** | Last Name of the keycloak user | [optional] 
**username** | **str** | Username of the keycloak user | [optional] 
**email** | **str** | Email address of the keycloak user | [optional] 

## Example

```python
from osbv2_api.workspaces.models.user import User

# TODO update the JSON string below
json = "{}"
# create an instance of User from a JSON string
user_instance = User.from_json(json)
# print the JSON string representation of the object
print(User.to_json())

# convert the object into a dict
user_dict = user_instance.to_dict()
# create an instance of User from a dict
user_from_dict = User.from_dict(user_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


