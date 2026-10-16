# WorkspaceRunRepo

The repository the notebooks are in.

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**dir** | **str** | The repository on the volume, as imported, inside the run&#39;s folder (e.g. the zip&#39;s &lt;repo&gt;-&lt;ref&gt;/). That folder is the notebooks&#39; project: the run copies the repository&#39;s files there, except names it already has (e.g. the input and output folders), and runs the notebooks from there as they would from the repository, so their executed copies can be run again in JupyterLab. The repository is left as it is. | 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


