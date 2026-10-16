# WorkspaceRunSetup

How to set up the repository before the notebooks run; paths it doesn't have are skipped.

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**requirements** | **str** | A requirements file in the repository, installed with pip first. | [optional] 
**python_path** | **[str]** | Folders in the repository to put on PYTHONPATH. | [optional] 
**install** | **[str]** | Candidates for installing the repository&#39;s own code; the first it has is used. A setup.py or pyproject.toml has its folder pip-installed; any other .py is run. A failure is logged and the run goes on. | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


