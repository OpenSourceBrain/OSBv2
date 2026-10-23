# WorkspaceRunResults

Where the run task's own products go on the volume.

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**notebooks** | **str** | Folder for the executed notebooks, created only if every notebook passes; if one fails, they are in &lt;folder&gt;.failed instead. To run them again in JupyterLab, it is their own folder in the project (e.g. &lt;run folder&gt;/notebooks): they replace the originals there. | 
**log** | **str** | The run&#39;s log file. The run is refused if it already exists. | 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


