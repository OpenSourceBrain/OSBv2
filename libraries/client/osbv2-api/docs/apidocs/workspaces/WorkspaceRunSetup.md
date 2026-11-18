# WorkspaceRunSetup

How to set up the repository before the notebooks run; paths it doesn't have are skipped.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**requirements** | **str** | A requirements file in the repository, installed with pip first. | [optional] 
**python_path** | **List[str]** | Folders in the repository to put on PYTHONPATH. | [optional] 
**install** | **List[str]** | Candidates for installing the repository&#39;s own code; the first it has is used. A setup.py or pyproject.toml has its folder pip-installed; any other .py is run. A failure is logged and the run goes on. | [optional] 

## Example

```python
from osbv2_api.workspaces.models.workspace_run_setup import WorkspaceRunSetup

# TODO update the JSON string below
json = "{}"
# create an instance of WorkspaceRunSetup from a JSON string
workspace_run_setup_instance = WorkspaceRunSetup.from_json(json)
# print the JSON string representation of the object
print(WorkspaceRunSetup.to_json())

# convert the object into a dict
workspace_run_setup_dict = workspace_run_setup_instance.to_dict()
# create an instance of WorkspaceRunSetup from a dict
workspace_run_setup_from_dict = WorkspaceRunSetup.from_dict(workspace_run_setup_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


