# WorkspaceImage

Workspace images of a workspace

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | [optional] 
**image** | **str** |  | 

## Example

```python
from osbv2_api.workspaces.models.workspace_image import WorkspaceImage

# TODO update the JSON string below
json = "{}"
# create an instance of WorkspaceImage from a JSON string
workspace_image_instance = WorkspaceImage.from_json(json)
# print the JSON string representation of the object
print(WorkspaceImage.to_json())

# convert the object into a dict
workspace_image_dict = workspace_image_instance.to_dict()
# create an instance of WorkspaceImage from a dict
workspace_image_from_dict = WorkspaceImage.from_dict(workspace_image_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


