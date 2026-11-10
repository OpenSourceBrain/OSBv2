# osbv2_api.workspaces.RestApi

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**delimage**](RestApi.md#delimage) | **DELETE** /workspace/{id}/gallery/{image_id} | Delete a Workspace Image from the workspace.
[**get_description**](RestApi.md#get_description) | **GET** /osbrepository/description | Used to retrieve description for a repository.
[**get_info**](RestApi.md#get_info) | **GET** /osbrepository/info | Used to retrieve a list of contexts of a repository.
[**osbrepository_get**](RestApi.md#osbrepository_get) | **GET** /osbrepository | Used to list all available repositories.
[**osbrepository_id_delete**](RestApi.md#osbrepository_id_delete) | **DELETE** /osbrepository/{id} | Delete a OSBRepository.
[**osbrepository_id_get**](RestApi.md#osbrepository_id_get) | **GET** /osbrepository/{id} | Used to retrieve a repository.
[**osbrepository_id_put**](RestApi.md#osbrepository_id_put) | **PUT** /osbrepository/{id} | Update a OSB repository.
[**osbrepository_post**](RestApi.md#osbrepository_post) | **POST** /osbrepository | Used to save a OSB Repository. The user_id (keycloak user id) will be automatically filled with the current user
[**tag_get**](RestApi.md#tag_get) | **GET** /tag | Used to list all available tags.
[**tag_id_delete**](RestApi.md#tag_id_delete) | **DELETE** /tag/{id} | Delete an tag from the repository.
[**tag_id_get**](RestApi.md#tag_id_get) | **GET** /tag/{id} | Used to retrieve an tag from the repository.
[**tag_id_put**](RestApi.md#tag_id_put) | **PUT** /tag/{id} | Update an tag in the repository.
[**tag_post**](RestApi.md#tag_post) | **POST** /tag | Used to save a Tag to the repository. The user_id (keycloak user id) will be automatically filled with the current user
[**user_resource_counts**](RestApi.md#user_resource_counts) | **GET** /user-resource-counts | Per-user workspace and repository counts (admin only).
[**volumestorage_get**](RestApi.md#volumestorage_get) | **GET** /volumestorage | Used to list all available volumestorages.
[**volumestorage_id_delete**](RestApi.md#volumestorage_id_delete) | **DELETE** /volumestorage/{id} | Delete an volumestorage from the repository.
[**volumestorage_id_get**](RestApi.md#volumestorage_id_get) | **GET** /volumestorage/{id} | Used to retrieve an volumestorage from the repository.
[**volumestorage_id_put**](RestApi.md#volumestorage_id_put) | **PUT** /volumestorage/{id} | Update an volumestorage in the repository.
[**volumestorage_post**](RestApi.md#volumestorage_post) | **POST** /volumestorage | Used to save a VolumeStorage to the repository. The user_id (keycloak user id) will be automatically filled with the current user
[**workspace_get**](RestApi.md#workspace_get) | **GET** /workspace | Used to list all available workspaces.
[**workspace_id_delete**](RestApi.md#workspace_id_delete) | **DELETE** /workspace/{id} | Delete a workspace from the repository.
[**workspace_id_get**](RestApi.md#workspace_id_get) | **GET** /workspace/{id} | Used to retrieve a workspace from the repository.
[**workspace_id_put**](RestApi.md#workspace_id_put) | **PUT** /workspace/{id} | Update a workspace in the repository.
[**workspace_post**](RestApi.md#workspace_post) | **POST** /workspace | Used to save a Workspace to the repository. The user_id (keycloak user id) will be automatically filled with the current user
[**workspaceresource_id_delete**](RestApi.md#workspaceresource_id_delete) | **DELETE** /workspaceresource/{id} | Delete a WorkspaceResource.
[**workspaceresource_id_get**](RestApi.md#workspaceresource_id_get) | **GET** /workspaceresource/{id} | Used to retrieve a WorkspaceResource.
[**workspaceresource_id_put**](RestApi.md#workspaceresource_id_put) | **PUT** /workspaceresource/{id} | Update the WorkspaceResource.
[**workspaceresource_post**](RestApi.md#workspaceresource_post) | **POST** /workspaceresource | Used to save a WorkspaceResource to the repository.
[**workspaces_controllers_osbrepository_controller_setthumbnail**](RestApi.md#workspaces_controllers_osbrepository_controller_setthumbnail) | **POST** /osbrepository/{id}/thumbnail/ | Sets the thumbnail of the workspace.
[**workspaces_controllers_workspace_controller_addimage**](RestApi.md#workspaces_controllers_workspace_controller_addimage) | **POST** /workspace/{id}/gallery | Adds and image to the workspace.
[**workspaces_controllers_workspace_controller_import_resources**](RestApi.md#workspaces_controllers_workspace_controller_import_resources) | **POST** /workspace/{id}/import | Imports the ResourceOrigins into the Workspace and creates/updates the workspace resources
[**workspaces_controllers_workspace_controller_setthumbnail**](RestApi.md#workspaces_controllers_workspace_controller_setthumbnail) | **POST** /workspace/{id}/thumbnail | Sets the thumbnail of the workspace.
[**workspaces_controllers_workspace_controller_workspace_clone**](RestApi.md#workspaces_controllers_workspace_controller_workspace_clone) | **PUT** /workspace/{id}/clone | Clones a workspace
[**workspaces_controllers_workspace_resource_controller_open**](RestApi.md#workspaces_controllers_workspace_resource_controller_open) | **GET** /workspaceresource/{id}/open | Used to register a WorkspaceResource open action. The WorkspaceResource timestamp last open will be updated


# **delimage**
> delimage(id, image_id)

Delete a Workspace Image from the workspace.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | Workspace ID of the workspace
    image_id = 56 # int | Workspace Image Id to be deleted from the workspace

    try:
        # Delete a Workspace Image from the workspace.
        api_instance.delimage(id, image_id)
    except Exception as e:
        print("Exception when calling RestApi->delimage: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Workspace ID of the workspace | 
 **image_id** | **int**| Workspace Image Id to be deleted from the workspace | 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The Workspace Image is successfully deleted from the workspace. |  -  |
**404** | The workspace was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_description**
> str get_description(uri, repository_type, context)

Used to retrieve description for a repository.

### Example


```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.repository_type import RepositoryType
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)


# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    uri = 'uri_example' # str | 
    repository_type = osbv2_api.workspaces.RepositoryType() # RepositoryType | 
    context = 'context_example' # str | 

    try:
        # Used to retrieve description for a repository.
        api_response = api_instance.get_description(uri, repository_type, context)
        print("The response of RestApi->get_description:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->get_description: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **uri** | **str**|  | 
 **repository_type** | [**RepositoryType**](.md)|  | 
 **context** | **str**|  | 

### Return type

**str**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The description for repository. |  -  |
**404** | The repository was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_info**
> RepositoryInfo get_info(uri, repository_type)

Used to retrieve a list of contexts of a repository.

### Example


```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.repository_info import RepositoryInfo
from osbv2_api.workspaces.models.repository_type import RepositoryType
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)


# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    uri = 'uri_example' # str | 
    repository_type = osbv2_api.workspaces.RepositoryType() # RepositoryType | 

    try:
        # Used to retrieve a list of contexts of a repository.
        api_response = api_instance.get_info(uri, repository_type)
        print("The response of RestApi->get_info:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->get_info: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **uri** | **str**|  | 
 **repository_type** | [**RepositoryType**](.md)|  | 

### Return type

[**RepositoryInfo**](RepositoryInfo.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The list of repository contexts. |  -  |
**404** | The repository was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **osbrepository_get**
> OsbrepositoryGet200Response osbrepository_get(page=page, per_page=per_page, q=q, tags=tags, types=types, user_id=user_id)

Used to list all available repositories.

### Example


```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.osbrepository_get200_response import OsbrepositoryGet200Response
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)


# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    page = 1 # int | The page number for starting to collect the result set. (optional) (default to 1)
    per_page = 20 # int | The number of items to return. (optional) (default to 20)
    q = 'name=myrepo+summary__like=%reposi%' # str | The search string for filtering of the items to return. Format [field/relation[field]][comparator = , __not= , __like= ][value]. Multiple parameters are concatenated with + (OR operator) (optional)
    tags = 'tag1+tag2' # str | The tags to filter with Multiple parameters are concatenated with + (OR operator) (optional)
    types = 'experimental+modeling' # str | The tags to filter with Multiple parameters are concatenated with + (OR operator) (optional)
    user_id = 'ccfbe969-f7e2-4191-80c4-821dc5a97a28' # str | The id of the owner user to filter with (optional)

    try:
        # Used to list all available repositories.
        api_response = api_instance.osbrepository_get(page=page, per_page=per_page, q=q, tags=tags, types=types, user_id=user_id)
        print("The response of RestApi->osbrepository_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->osbrepository_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| The page number for starting to collect the result set. | [optional] [default to 1]
 **per_page** | **int**| The number of items to return. | [optional] [default to 20]
 **q** | **str**| The search string for filtering of the items to return. Format [field/relation[field]][comparator &#x3D; , __not&#x3D; , __like&#x3D; ][value]. Multiple parameters are concatenated with + (OR operator) | [optional] 
 **tags** | **str**| The tags to filter with Multiple parameters are concatenated with + (OR operator) | [optional] 
 **types** | **str**| The tags to filter with Multiple parameters are concatenated with + (OR operator) | [optional] 
 **user_id** | **str**| The id of the owner user to filter with | [optional] 

### Return type

[**OsbrepositoryGet200Response**](OsbrepositoryGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Return all available repositories |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **osbrepository_id_delete**
> osbrepository_id_delete(id, context=context)

Delete a OSBRepository.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 
    context = 'context_example' # str | the context for getting the resources, optional (optional)

    try:
        # Delete a OSBRepository.
        api_instance.osbrepository_id_delete(id, context=context)
    except Exception as e:
        print("Exception when calling RestApi->osbrepository_id_delete: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **context** | **str**| the context for getting the resources, optional | [optional] 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The OSBRepository was deleted. |  -  |
**404** | The OSBRepository was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **osbrepository_id_get**
> OSBRepository osbrepository_id_get(id, context=context)

Used to retrieve a repository.

### Example


```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.osb_repository import OSBRepository
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)


# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 
    context = 'context_example' # str | the context for getting the resources, optional (optional)

    try:
        # Used to retrieve a repository.
        api_response = api_instance.osbrepository_id_get(id, context=context)
        print("The response of RestApi->osbrepository_id_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->osbrepository_id_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **context** | **str**| the context for getting the resources, optional | [optional] 

### Return type

[**OSBRepository**](OSBRepository.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The repository. |  -  |
**404** | The repository was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **osbrepository_id_put**
> OSBRepository osbrepository_id_put(id, osb_repository, context=context)

Update a OSB repository.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.osb_repository import OSBRepository
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 
    osb_repository = osbv2_api.workspaces.OSBRepository() # OSBRepository | The repository to save.
    context = 'context_example' # str | the context for getting the resources, optional (optional)

    try:
        # Update a OSB repository.
        api_response = api_instance.osbrepository_id_put(id, osb_repository, context=context)
        print("The response of RestApi->osbrepository_id_put:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->osbrepository_id_put: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **osb_repository** | [**OSBRepository**](OSBRepository.md)| The repository to save. | 
 **context** | **str**| the context for getting the resources, optional | [optional] 

### Return type

[**OSBRepository**](OSBRepository.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The workspace was updated. |  -  |
**404** | The workspace was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **osbrepository_post**
> OSBRepository osbrepository_post(osb_repository)

Used to save a OSB Repository. The user_id (keycloak user id) will be automatically filled with the current user

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.osb_repository import OSBRepository
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    osb_repository = osbv2_api.workspaces.OSBRepository() # OSBRepository | The OSB repository to save.

    try:
        # Used to save a OSB Repository. The user_id (keycloak user id) will be automatically filled with the current user
        api_response = api_instance.osbrepository_post(osb_repository)
        print("The response of RestApi->osbrepository_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->osbrepository_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **osb_repository** | [**OSBRepository**](OSBRepository.md)| The OSB repository to save. | 

### Return type

[**OSBRepository**](OSBRepository.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Save successful. |  -  |
**400** | The OSB repository already exists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tag_get**
> TagGet200Response tag_get(page=page, per_page=per_page, q=q)

Used to list all available tags.

### Example


```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.tag_get200_response import TagGet200Response
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)


# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    page = 1 # int | The page number for starting to collect the result set. (optional) (default to 1)
    per_page = 20 # int | The number of items to return. (optional) (default to 20)
    q = 'name__like=%Tag 1%' # str | The search string for filtering of the items to return. Format [field/relation[field]][comparator = , __not= , __like= ][value] (optional)

    try:
        # Used to list all available tags.
        api_response = api_instance.tag_get(page=page, per_page=per_page, q=q)
        print("The response of RestApi->tag_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->tag_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| The page number for starting to collect the result set. | [optional] [default to 1]
 **per_page** | **int**| The number of items to return. | [optional] [default to 20]
 **q** | **str**| The search string for filtering of the items to return. Format [field/relation[field]][comparator &#x3D; , __not&#x3D; , __like&#x3D; ][value] | [optional] 

### Return type

[**TagGet200Response**](TagGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Return all available tags |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tag_id_delete**
> tag_id_delete(id)

Delete an tag from the repository.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 

    try:
        # Delete an tag from the repository.
        api_instance.tag_id_delete(id)
    except Exception as e:
        print("Exception when calling RestApi->tag_id_delete: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The tag was deleted. |  -  |
**404** | The tag was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tag_id_get**
> Tag tag_id_get(id)

Used to retrieve an tag from the repository.

### Example


```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.tag import Tag
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)


# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 

    try:
        # Used to retrieve an tag from the repository.
        api_response = api_instance.tag_id_get(id)
        print("The response of RestApi->tag_id_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->tag_id_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**Tag**](Tag.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The tag. |  -  |
**404** | The tag was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tag_id_put**
> Tag tag_id_put(id, tag)

Update an tag in the repository.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.tag import Tag
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 
    tag = osbv2_api.workspaces.Tag() # Tag | The tag to save.

    try:
        # Update an tag in the repository.
        api_response = api_instance.tag_id_put(id, tag)
        print("The response of RestApi->tag_id_put:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->tag_id_put: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **tag** | [**Tag**](Tag.md)| The tag to save. | 

### Return type

[**Tag**](Tag.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The tag was updated. |  -  |
**404** | The tag was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tag_post**
> Tag tag_post(tag)

Used to save a Tag to the repository. The user_id (keycloak user id) will be automatically filled with the current user

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.tag import Tag
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    tag = osbv2_api.workspaces.Tag() # Tag | The Tag to save.

    try:
        # Used to save a Tag to the repository. The user_id (keycloak user id) will be automatically filled with the current user
        api_response = api_instance.tag_post(tag)
        print("The response of RestApi->tag_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->tag_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tag** | [**Tag**](Tag.md)| The Tag to save. | 

### Return type

[**Tag**](Tag.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Save successful. |  -  |
**400** | The Tag already exists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **user_resource_counts**
> Dict[str, UserResourceCounts200ResponseValue] user_resource_counts()

Per-user workspace and repository counts (admin only).

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.user_resource_counts200_response_value import UserResourceCounts200ResponseValue
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)

    try:
        # Per-user workspace and repository counts (admin only).
        api_response = api_instance.user_resource_counts()
        print("The response of RestApi->user_resource_counts:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->user_resource_counts: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**Dict[str, UserResourceCounts200ResponseValue]**](UserResourceCounts200ResponseValue.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Per-user workspace and repository counts. |  -  |
**401** | The user is not authorized. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **volumestorage_get**
> VolumestorageGet200Response volumestorage_get(page=page, per_page=per_page, q=q)

Used to list all available volumestorages.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.volumestorage_get200_response import VolumestorageGet200Response
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    page = 1 # int | The page number for starting to collect the result set. (optional) (default to 1)
    per_page = 20 # int | The number of items to return. (optional) (default to 20)
    q = 'name__like=%storage%' # str | The search string for filtering of the items to return. Format [field/relation[field]][comparator = , __not= , __like= ][value] (optional)

    try:
        # Used to list all available volumestorages.
        api_response = api_instance.volumestorage_get(page=page, per_page=per_page, q=q)
        print("The response of RestApi->volumestorage_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->volumestorage_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| The page number for starting to collect the result set. | [optional] [default to 1]
 **per_page** | **int**| The number of items to return. | [optional] [default to 20]
 **q** | **str**| The search string for filtering of the items to return. Format [field/relation[field]][comparator &#x3D; , __not&#x3D; , __like&#x3D; ][value] | [optional] 

### Return type

[**VolumestorageGet200Response**](VolumestorageGet200Response.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Return all available volumestorages |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **volumestorage_id_delete**
> volumestorage_id_delete(id)

Delete an volumestorage from the repository.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 

    try:
        # Delete an volumestorage from the repository.
        api_instance.volumestorage_id_delete(id)
    except Exception as e:
        print("Exception when calling RestApi->volumestorage_id_delete: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The volumestorage was deleted. |  -  |
**404** | The volumestorage was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **volumestorage_id_get**
> VolumeStorage volumestorage_id_get(id)

Used to retrieve an volumestorage from the repository.

### Example


```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.volume_storage import VolumeStorage
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)


# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 

    try:
        # Used to retrieve an volumestorage from the repository.
        api_response = api_instance.volumestorage_id_get(id)
        print("The response of RestApi->volumestorage_id_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->volumestorage_id_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**VolumeStorage**](VolumeStorage.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The volumestorage. |  -  |
**404** | The volumestorage was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **volumestorage_id_put**
> VolumeStorage volumestorage_id_put(id, volume_storage)

Update an volumestorage in the repository.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.volume_storage import VolumeStorage
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 
    volume_storage = osbv2_api.workspaces.VolumeStorage() # VolumeStorage | The volumestorage to save.

    try:
        # Update an volumestorage in the repository.
        api_response = api_instance.volumestorage_id_put(id, volume_storage)
        print("The response of RestApi->volumestorage_id_put:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->volumestorage_id_put: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **volume_storage** | [**VolumeStorage**](VolumeStorage.md)| The volumestorage to save. | 

### Return type

[**VolumeStorage**](VolumeStorage.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The volumestorage was updated. |  -  |
**404** | The volumestorage was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **volumestorage_post**
> VolumeStorage volumestorage_post(volume_storage)

Used to save a VolumeStorage to the repository. The user_id (keycloak user id) will be automatically filled with the current user

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.volume_storage import VolumeStorage
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    volume_storage = osbv2_api.workspaces.VolumeStorage() # VolumeStorage | The VolumeStorage to save.

    try:
        # Used to save a VolumeStorage to the repository. The user_id (keycloak user id) will be automatically filled with the current user
        api_response = api_instance.volumestorage_post(volume_storage)
        print("The response of RestApi->volumestorage_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->volumestorage_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **volume_storage** | [**VolumeStorage**](VolumeStorage.md)| The VolumeStorage to save. | 

### Return type

[**VolumeStorage**](VolumeStorage.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Save successful. |  -  |
**400** | The VolumeStorage already exists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspace_get**
> WorkspaceGet200Response workspace_get(page=page, per_page=per_page, q=q, tags=tags)

Used to list all available workspaces.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.workspace_get200_response import WorkspaceGet200Response
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    page = 1 # int | The page number for starting to collect the result set. (optional) (default to 1)
    per_page = 20 # int | The number of items to return. (optional) (default to 20)
    q = 'name__like=Work%+id__=1+tags[tag]=Tag' # str | The search string for filtering of the items to return. Multiple criteria are seperated by '+' (and operator is applied). Format [field/relation[field]][comparator = , __not= , __like= ][value] (optional)
    tags = 'tag1+tag2' # str | The tags to filter with Multiple parameters are concatenated with + (OR operator) (optional)

    try:
        # Used to list all available workspaces.
        api_response = api_instance.workspace_get(page=page, per_page=per_page, q=q, tags=tags)
        print("The response of RestApi->workspace_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->workspace_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| The page number for starting to collect the result set. | [optional] [default to 1]
 **per_page** | **int**| The number of items to return. | [optional] [default to 20]
 **q** | **str**| The search string for filtering of the items to return. Multiple criteria are seperated by &#39;+&#39; (and operator is applied). Format [field/relation[field]][comparator &#x3D; , __not&#x3D; , __like&#x3D; ][value] | [optional] 
 **tags** | **str**| The tags to filter with Multiple parameters are concatenated with + (OR operator) | [optional] 

### Return type

[**WorkspaceGet200Response**](WorkspaceGet200Response.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Return all available workspaces |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspace_id_delete**
> workspace_id_delete(id)

Delete a workspace from the repository.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 

    try:
        # Delete a workspace from the repository.
        api_instance.workspace_id_delete(id)
    except Exception as e:
        print("Exception when calling RestApi->workspace_id_delete: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The workspace was deleted. |  -  |
**404** | The workspace was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspace_id_get**
> Workspace workspace_id_get(id)

Used to retrieve a workspace from the repository.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.workspace import Workspace
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 

    try:
        # Used to retrieve a workspace from the repository.
        api_response = api_instance.workspace_id_get(id)
        print("The response of RestApi->workspace_id_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->workspace_id_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**Workspace**](Workspace.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The workspace. |  -  |
**404** | The workspace was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspace_id_put**
> Workspace workspace_id_put(id, workspace)

Update a workspace in the repository.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.workspace import Workspace
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 
    workspace = osbv2_api.workspaces.Workspace() # Workspace | The workspace to save.

    try:
        # Update a workspace in the repository.
        api_response = api_instance.workspace_id_put(id, workspace)
        print("The response of RestApi->workspace_id_put:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->workspace_id_put: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **workspace** | [**Workspace**](Workspace.md)| The workspace to save. | 

### Return type

[**Workspace**](Workspace.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The workspace was updated. |  -  |
**404** | The workspace was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspace_post**
> Workspace workspace_post(workspace)

Used to save a Workspace to the repository. The user_id (keycloak user id) will be automatically filled with the current user

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.workspace import Workspace
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    workspace = osbv2_api.workspaces.Workspace() # Workspace | The Workspace to save.

    try:
        # Used to save a Workspace to the repository. The user_id (keycloak user id) will be automatically filled with the current user
        api_response = api_instance.workspace_post(workspace)
        print("The response of RestApi->workspace_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->workspace_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workspace** | [**Workspace**](Workspace.md)| The Workspace to save. | 

### Return type

[**Workspace**](Workspace.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Save successful. |  -  |
**400** | The Workspace already exists. |  -  |
**405** | Not allowed to create a new workspace |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspaceresource_id_delete**
> workspaceresource_id_delete(id)

Delete a WorkspaceResource.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 

    try:
        # Delete a WorkspaceResource.
        api_instance.workspaceresource_id_delete(id)
    except Exception as e:
        print("Exception when calling RestApi->workspaceresource_id_delete: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The WorkspaceResource was deleted. |  -  |
**404** | The WorkspaceResource was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspaceresource_id_get**
> WorkspaceResource workspaceresource_id_get(id)

Used to retrieve a WorkspaceResource.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.workspace_resource import WorkspaceResource
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 

    try:
        # Used to retrieve a WorkspaceResource.
        api_response = api_instance.workspaceresource_id_get(id)
        print("The response of RestApi->workspaceresource_id_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->workspaceresource_id_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**WorkspaceResource**](WorkspaceResource.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The WorkspaceResource. |  -  |
**404** | The WorkspaceResource was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspaceresource_id_put**
> WorkspaceResource workspaceresource_id_put(id, workspace_resource)

Update the WorkspaceResource.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.workspace_resource import WorkspaceResource
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | 
    workspace_resource = osbv2_api.workspaces.WorkspaceResource() # WorkspaceResource | The WorkspaceResource to save.

    try:
        # Update the WorkspaceResource.
        api_response = api_instance.workspaceresource_id_put(id, workspace_resource)
        print("The response of RestApi->workspaceresource_id_put:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->workspaceresource_id_put: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **workspace_resource** | [**WorkspaceResource**](WorkspaceResource.md)| The WorkspaceResource to save. | 

### Return type

[**WorkspaceResource**](WorkspaceResource.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The WorkspaceResource was updated. |  -  |
**404** | The WorkspaceResource was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspaceresource_post**
> WorkspaceResource workspaceresource_post(workspace_resource)

Used to save a WorkspaceResource to the repository.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.workspace_resource import WorkspaceResource
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    workspace_resource = osbv2_api.workspaces.WorkspaceResource() # WorkspaceResource | The WorkspaceResource to save.

    try:
        # Used to save a WorkspaceResource to the repository.
        api_response = api_instance.workspaceresource_post(workspace_resource)
        print("The response of RestApi->workspaceresource_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->workspaceresource_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workspace_resource** | [**WorkspaceResource**](WorkspaceResource.md)| The WorkspaceResource to save. | 

### Return type

[**WorkspaceResource**](WorkspaceResource.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Save successful. |  -  |
**400** | The WorkspaceResource already exists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspaces_controllers_osbrepository_controller_setthumbnail**
> workspaces_controllers_osbrepository_controller_setthumbnail(id, thumb_nail=thumb_nail)

Sets the thumbnail of the workspace.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | Repository ID 
    thumb_nail = None # bytes |  (optional)

    try:
        # Sets the thumbnail of the workspace.
        api_instance.workspaces_controllers_osbrepository_controller_setthumbnail(id, thumb_nail=thumb_nail)
    except Exception as e:
        print("Exception when calling RestApi->workspaces_controllers_osbrepository_controller_setthumbnail: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Repository ID  | 
 **thumb_nail** | **bytes**|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The repository was updated with the thumbnail. |  -  |
**404** | The repository was not found or the thumbnail was not specified |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspaces_controllers_workspace_controller_addimage**
> workspaces_controllers_workspace_controller_addimage(id, image=image)

Adds and image to the workspace.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | Workspace ID of the workspace
    image = None # bytes |  (optional)

    try:
        # Adds and image to the workspace.
        api_instance.workspaces_controllers_workspace_controller_addimage(id, image=image)
    except Exception as e:
        print("Exception when calling RestApi->workspaces_controllers_workspace_controller_addimage: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Workspace ID of the workspace | 
 **image** | **bytes**|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The image was added to the workspace. |  -  |
**404** | The workspace was not found or the image was not specified |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspaces_controllers_workspace_controller_import_resources**
> workspaces_controllers_workspace_controller_import_resources(id, workspaces_controllers_workspace_controller_import_resources_request=workspaces_controllers_workspace_controller_import_resources_request)

Imports the ResourceOrigins into the Workspace and creates/updates the workspace resources

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.workspaces_controllers_workspace_controller_import_resources_request import WorkspacesControllersWorkspaceControllerImportResourcesRequest
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | Workspace ID of the workspace
    workspaces_controllers_workspace_controller_import_resources_request = osbv2_api.workspaces.WorkspacesControllersWorkspaceControllerImportResourcesRequest() # WorkspacesControllersWorkspaceControllerImportResourcesRequest |  (optional)

    try:
        # Imports the ResourceOrigins into the Workspace and creates/updates the workspace resources
        api_instance.workspaces_controllers_workspace_controller_import_resources(id, workspaces_controllers_workspace_controller_import_resources_request=workspaces_controllers_workspace_controller_import_resources_request)
    except Exception as e:
        print("Exception when calling RestApi->workspaces_controllers_workspace_controller_import_resources: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Workspace ID of the workspace | 
 **workspaces_controllers_workspace_controller_import_resources_request** | [**WorkspacesControllersWorkspaceControllerImportResourcesRequest**](WorkspacesControllersWorkspaceControllerImportResourcesRequest.md)|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The workspace was updated with the thumbnail. |  -  |
**404** | The workspace was not found or the thumbnail was not specified |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspaces_controllers_workspace_controller_setthumbnail**
> workspaces_controllers_workspace_controller_setthumbnail(id, thumb_nail=thumb_nail)

Sets the thumbnail of the workspace.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | Workspace ID of the workspace
    thumb_nail = None # bytes |  (optional)

    try:
        # Sets the thumbnail of the workspace.
        api_instance.workspaces_controllers_workspace_controller_setthumbnail(id, thumb_nail=thumb_nail)
    except Exception as e:
        print("Exception when calling RestApi->workspaces_controllers_workspace_controller_setthumbnail: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Workspace ID of the workspace | 
 **thumb_nail** | **bytes**|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The workspace was updated with the thumbnail. |  -  |
**404** | The workspace was not found or the thumbnail was not specified |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspaces_controllers_workspace_controller_workspace_clone**
> Workspace workspaces_controllers_workspace_controller_workspace_clone(id)

Clones a workspace

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.workspace import Workspace
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | Workspace ID of the workspace

    try:
        # Clones a workspace
        api_response = api_instance.workspaces_controllers_workspace_controller_workspace_clone(id)
        print("The response of RestApi->workspaces_controllers_workspace_controller_workspace_clone:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RestApi->workspaces_controllers_workspace_controller_workspace_clone: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Workspace ID of the workspace | 

### Return type

[**Workspace**](Workspace.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The workspace was cloned. |  -  |
**404** | The workspace was not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspaces_controllers_workspace_resource_controller_open**
> workspaces_controllers_workspace_resource_controller_open(id)

Used to register a WorkspaceResource open action. The WorkspaceResource timestamp last open will be updated

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api
# See configuration.py for a list of all supported configuration parameters.
configuration = osbv2_api.workspaces.Configuration(
    host = "/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osbv2_api.workspaces.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with osbv2_api.workspaces.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = osbv2_api.workspaces.RestApi(api_client)
    id = 56 # int | WorkspaceResource ID of the WorkspaceResource

    try:
        # Used to register a WorkspaceResource open action. The WorkspaceResource timestamp last open will be updated
        api_instance.workspaces_controllers_workspace_resource_controller_open(id)
    except Exception as e:
        print("Exception when calling RestApi->workspaces_controllers_workspace_resource_controller_open: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| WorkspaceResource ID of the WorkspaceResource | 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The WorkspaceResource was updated. |  -  |
**404** | The WorkspaceResource was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

