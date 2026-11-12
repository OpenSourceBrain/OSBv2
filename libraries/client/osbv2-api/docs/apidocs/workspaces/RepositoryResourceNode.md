# RepositoryResourceNode

Tree node (files/folders) of a Repository tree

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**resource** | [**RepositoryResource**](RepositoryResource.md) |  | [optional] 
**children** | [**List[RepositoryResourceNode]**](RepositoryResourceNode.md) |  | [optional] 

## Example

```python
from osbv2_api.workspaces.models.repository_resource_node import RepositoryResourceNode

# TODO update the JSON string below
json = "{}"
# create an instance of RepositoryResourceNode from a JSON string
repository_resource_node_instance = RepositoryResourceNode.from_json(json)
# print the JSON string representation of the object
print(RepositoryResourceNode.to_json())

# convert the object into a dict
repository_resource_node_dict = repository_resource_node_instance.to_dict()
# create an instance of RepositoryResourceNode from a dict
repository_resource_node_from_dict = RepositoryResourceNode.from_dict(repository_resource_node_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


