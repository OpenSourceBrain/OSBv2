# OSBRepository

OSBRepository extended model

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | Repository name. | 
**repository_type** | [**RepositoryType**](RepositoryType.md) |  | 
**content_types** | **str** | List of Repository Content Types | 
**uri** | **str** | URI of the repository | 
**id** | **int** |  | [optional] 
**summary** | **str** | Summary describing the OSB Repository | [optional] 
**auto_sync** | **bool** | Auto sync of the resources | [optional]  if omitted the server will use the default value of True
**default_context** | **str** | The default branch to show for this repository | [optional] 
**user_id** | **str** | OSBRepository keycloak user id, will be automatically be set to the logged in user | [optional] 
**timestamp_created** | **datetime** | Date/time the Workspace is created | [optional] 
**timestamp_updated** | **datetime** | Date/time the Workspace is last updated | [optional] 
**tags** | **[dict]** |  | [optional] 
**context_resources** | [**RepositoryResourceNode**](RepositoryResourceNode.md) |  | [optional] 
**contexts** | **[str]** |  | [optional] 
**user** | [**User**](User.md) |  | [optional] 
**content_types_list** | [**[RepositoryContentType]**](RepositoryContentType.md) |  | [optional] 
**description** | **str** | Repository description | [optional] 
**timestamp_modified** | **datetime** | Date/time the OSBReposity is last modified | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


