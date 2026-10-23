# WorkspaceRunRequest

What to run, how to set it up, and where its files go. All paths are relative.

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**repo** | [**WorkspaceRunRepo**](WorkspaceRunRepo.md) |  | 
**notebooks** | **[str]** | The notebooks to run, relative to repo.dir, in this order. Each runs in its own folder in the project (see repo.dir); the run stops at the first that fails. | 
**output_dir** | **str** | Where the notebooks write their results on the volume, passed to them as their OUTPUT_DIR parameter, relative to the notebook&#39;s folder. | 
**results** | [**WorkspaceRunResults**](WorkspaceRunResults.md) |  | 
**setup** | [**WorkspaceRunSetup**](WorkspaceRunSetup.md) |  | [optional] 
**input_dir** | **str** | The run&#39;s input on the volume, passed to the notebooks as their INPUT_DIR parameter, relative to the notebook&#39;s folder. Without it they use their own default (e.g. example data). | [optional] 
**image** | **str** | The image to run the notebooks in: an OSB workspace application (e.g. netpyne) or an image from a trusted registry. Defaults to OSB&#39;s JupyterLab. | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


