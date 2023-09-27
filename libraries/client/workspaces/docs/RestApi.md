# workspaces_cli.RestApi

All URIs are relative to *http://localhost/api*

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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | Workspace ID of the workspace
    image_id = 1 # int | Workspace Image Id to be deleted from the workspace

    # example passing only required values which don't have defaults set
    try:
        # Delete a Workspace Image from the workspace.
        api_instance.delimage(id, image_id)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.repository_type import RepositoryType
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)


# Enter a context with an instance of the API client
with workspaces_cli.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    uri = "uri_example" # str | 
    repository_type = RepositoryType("dandi") # RepositoryType | 
    context = "context_example" # str | 

    # example passing only required values which don't have defaults set
    try:
        # Used to retrieve description for a repository.
        api_response = api_instance.get_description(uri, repository_type, context)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->get_description: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **uri** | **str**|  |
 **repository_type** | **RepositoryType**|  |
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.repository_type import RepositoryType
from workspaces_cli.model.repository_info import RepositoryInfo
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)


# Enter a context with an instance of the API client
with workspaces_cli.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    uri = "uri_example" # str | 
    repository_type = RepositoryType("dandi") # RepositoryType | 

    # example passing only required values which don't have defaults set
    try:
        # Used to retrieve a list of contexts of a repository.
        api_response = api_instance.get_info(uri, repository_type)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->get_info: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **uri** | **str**|  |
 **repository_type** | **RepositoryType**|  |

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
> InlineResponse2001 osbrepository_get()

Used to list all available repositories.

### Example

```python
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.inline_response2001 import InlineResponse2001
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)


# Enter a context with an instance of the API client
with workspaces_cli.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    page = 1 # int | The page number for starting to collect the result set. (optional) if omitted the server will use the default value of 1
    per_page = 20 # int | The number of items to return. (optional) if omitted the server will use the default value of 20
    q = "name=myrepo+summary__like=%reposi%" # str, none_type | The search string for filtering of the items to return. Format [field/relation[field]][comparator = , __not= , __like= ][value]. Multiple parameters are concatenated with + (OR operator) (optional)
    tags = "tag1+tag2" # str, none_type | The tags to filter with Multiple parameters are concatenated with + (OR operator) (optional)
    types = "experimental+modeling" # str, none_type | The tags to filter with Multiple parameters are concatenated with + (OR operator) (optional)
    user_id = "ccfbe969-f7e2-4191-80c4-821dc5a97a28" # str, none_type | The id of the owner user to filter with (optional)

    # example passing only required values which don't have defaults set
    # and optional values
    try:
        # Used to list all available repositories.
        api_response = api_instance.osbrepository_get(page=page, per_page=per_page, q=q, tags=tags, types=types, user_id=user_id)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->osbrepository_get: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| The page number for starting to collect the result set. | [optional] if omitted the server will use the default value of 1
 **per_page** | **int**| The number of items to return. | [optional] if omitted the server will use the default value of 20
 **q** | **str, none_type**| The search string for filtering of the items to return. Format [field/relation[field]][comparator &#x3D; , __not&#x3D; , __like&#x3D; ][value]. Multiple parameters are concatenated with + (OR operator) | [optional]
 **tags** | **str, none_type**| The tags to filter with Multiple parameters are concatenated with + (OR operator) | [optional]
 **types** | **str, none_type**| The tags to filter with Multiple parameters are concatenated with + (OR operator) | [optional]
 **user_id** | **str, none_type**| The id of the owner user to filter with | [optional]

### Return type

[**InlineResponse2001**](InlineResponse2001.md)

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
> osbrepository_id_delete(id)

Delete a OSBRepository.

### Example

* Bearer (JWT) Authentication (bearerAuth):
```python
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 
    context = "context_example" # str | the context for getting the resources, optional (optional)

    # example passing only required values which don't have defaults set
    try:
        # Delete a OSBRepository.
        api_instance.osbrepository_id_delete(id)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->osbrepository_id_delete: %s\n" % e)

    # example passing only required values which don't have defaults set
    # and optional values
    try:
        # Delete a OSBRepository.
        api_instance.osbrepository_id_delete(id, context=context)
    except workspaces_cli.ApiException as e:
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
> OSBRepository osbrepository_id_get(id)

Used to retrieve a repository.

### Example

```python
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.osb_repository import OSBRepository
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)


# Enter a context with an instance of the API client
with workspaces_cli.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 
    context = "context_example" # str | the context for getting the resources, optional (optional)

    # example passing only required values which don't have defaults set
    try:
        # Used to retrieve a repository.
        api_response = api_instance.osbrepository_id_get(id)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->osbrepository_id_get: %s\n" % e)

    # example passing only required values which don't have defaults set
    # and optional values
    try:
        # Used to retrieve a repository.
        api_response = api_instance.osbrepository_id_get(id, context=context)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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
> OSBRepository osbrepository_id_put(id, osb_repository)

Update a OSB repository.

### Example

* Bearer (JWT) Authentication (bearerAuth):
```python
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.osb_repository import OSBRepository
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 
    osb_repository = OSBRepository() # OSBRepository | The repository to save.
    context = "context_example" # str | the context for getting the resources, optional (optional)

    # example passing only required values which don't have defaults set
    try:
        # Update a OSB repository.
        api_response = api_instance.osbrepository_id_put(id, osb_repository)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->osbrepository_id_put: %s\n" % e)

    # example passing only required values which don't have defaults set
    # and optional values
    try:
        # Update a OSB repository.
        api_response = api_instance.osbrepository_id_put(id, osb_repository, context=context)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.osb_repository import OSBRepository
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    osb_repository = OSBRepository() # OSBRepository | The OSB repository to save.

    # example passing only required values which don't have defaults set
    try:
        # Used to save a OSB Repository. The user_id (keycloak user id) will be automatically filled with the current user
        api_response = api_instance.osbrepository_post(osb_repository)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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
> InlineResponse2003 tag_get()

Used to list all available tags.

### Example

```python
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.inline_response2003 import InlineResponse2003
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)


# Enter a context with an instance of the API client
with workspaces_cli.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    page = 1 # int | The page number for starting to collect the result set. (optional) if omitted the server will use the default value of 1
    per_page = 20 # int | The number of items to return. (optional) if omitted the server will use the default value of 20
    q = "name__like=%Tag 1%" # str | The search string for filtering of the items to return. Format [field/relation[field]][comparator = , __not= , __like= ][value] (optional)

    # example passing only required values which don't have defaults set
    # and optional values
    try:
        # Used to list all available tags.
        api_response = api_instance.tag_get(page=page, per_page=per_page, q=q)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->tag_get: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| The page number for starting to collect the result set. | [optional] if omitted the server will use the default value of 1
 **per_page** | **int**| The number of items to return. | [optional] if omitted the server will use the default value of 20
 **q** | **str**| The search string for filtering of the items to return. Format [field/relation[field]][comparator &#x3D; , __not&#x3D; , __like&#x3D; ][value] | [optional]

### Return type

[**InlineResponse2003**](InlineResponse2003.md)

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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 

    # example passing only required values which don't have defaults set
    try:
        # Delete an tag from the repository.
        api_instance.tag_id_delete(id)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.tag import Tag
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)


# Enter a context with an instance of the API client
with workspaces_cli.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 

    # example passing only required values which don't have defaults set
    try:
        # Used to retrieve an tag from the repository.
        api_response = api_instance.tag_id_get(id)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.tag import Tag
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 
    tag = Tag(
        id=1,
        tag="tag_example",
    ) # Tag | The tag to save.

    # example passing only required values which don't have defaults set
    try:
        # Update an tag in the repository.
        api_response = api_instance.tag_id_put(id, tag)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.tag import Tag
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    tag = Tag(
        id=1,
        tag="tag_example",
    ) # Tag | The Tag to save.

    # example passing only required values which don't have defaults set
    try:
        # Used to save a Tag to the repository. The user_id (keycloak user id) will be automatically filled with the current user
        api_response = api_instance.tag_post(tag)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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

# **volumestorage_get**
> InlineResponse2002 volumestorage_get()

Used to list all available volumestorages.

### Example

* Bearer (JWT) Authentication (bearerAuth):
```python
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.inline_response2002 import InlineResponse2002
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    page = 1 # int | The page number for starting to collect the result set. (optional) if omitted the server will use the default value of 1
    per_page = 20 # int | The number of items to return. (optional) if omitted the server will use the default value of 20
    q = "name__like=%storage%" # str | The search string for filtering of the items to return. Format [field/relation[field]][comparator = , __not= , __like= ][value] (optional)

    # example passing only required values which don't have defaults set
    # and optional values
    try:
        # Used to list all available volumestorages.
        api_response = api_instance.volumestorage_get(page=page, per_page=per_page, q=q)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->volumestorage_get: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| The page number for starting to collect the result set. | [optional] if omitted the server will use the default value of 1
 **per_page** | **int**| The number of items to return. | [optional] if omitted the server will use the default value of 20
 **q** | **str**| The search string for filtering of the items to return. Format [field/relation[field]][comparator &#x3D; , __not&#x3D; , __like&#x3D; ][value] | [optional]

### Return type

[**InlineResponse2002**](InlineResponse2002.md)

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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 

    # example passing only required values which don't have defaults set
    try:
        # Delete an volumestorage from the repository.
        api_instance.volumestorage_id_delete(id)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.volume_storage import VolumeStorage
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)


# Enter a context with an instance of the API client
with workspaces_cli.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 

    # example passing only required values which don't have defaults set
    try:
        # Used to retrieve an volumestorage from the repository.
        api_response = api_instance.volumestorage_id_get(id)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.volume_storage import VolumeStorage
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 
    volume_storage = VolumeStorage(
        id=1,
        name="Storage Volume One",
    ) # VolumeStorage | The volumestorage to save.

    # example passing only required values which don't have defaults set
    try:
        # Update an volumestorage in the repository.
        api_response = api_instance.volumestorage_id_put(id, volume_storage)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.volume_storage import VolumeStorage
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    volume_storage = VolumeStorage(
        id=1,
        name="Storage Volume One",
    ) # VolumeStorage | The VolumeStorage to save.

    # example passing only required values which don't have defaults set
    try:
        # Used to save a VolumeStorage to the repository. The user_id (keycloak user id) will be automatically filled with the current user
        api_response = api_instance.volumestorage_post(volume_storage)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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
> InlineResponse200 workspace_get()

Used to list all available workspaces.

### Example

* Bearer (JWT) Authentication (bearerAuth):
```python
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.inline_response200 import InlineResponse200
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    page = 1 # int | The page number for starting to collect the result set. (optional) if omitted the server will use the default value of 1
    per_page = 20 # int | The number of items to return. (optional) if omitted the server will use the default value of 20
    q = "name__like=Work%+id__=1+tags[tag]=Tag" # str | The search string for filtering of the items to return. Multiple criteria are seperated by '+' (and operator is applied). Format [field/relation[field]][comparator = , __not= , __like= ][value] (optional)
    tags = "tag1+tag2" # str, none_type | The tags to filter with Multiple parameters are concatenated with + (OR operator) (optional)

    # example passing only required values which don't have defaults set
    # and optional values
    try:
        # Used to list all available workspaces.
        api_response = api_instance.workspace_get(page=page, per_page=per_page, q=q, tags=tags)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->workspace_get: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| The page number for starting to collect the result set. | [optional] if omitted the server will use the default value of 1
 **per_page** | **int**| The number of items to return. | [optional] if omitted the server will use the default value of 20
 **q** | **str**| The search string for filtering of the items to return. Multiple criteria are seperated by &#39;+&#39; (and operator is applied). Format [field/relation[field]][comparator &#x3D; , __not&#x3D; , __like&#x3D; ][value] | [optional]
 **tags** | **str, none_type**| The tags to filter with Multiple parameters are concatenated with + (OR operator) | [optional]

### Return type

[**InlineResponse200**](InlineResponse200.md)

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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 

    # example passing only required values which don't have defaults set
    try:
        # Delete a workspace from the repository.
        api_instance.workspace_id_delete(id)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.workspace import Workspace
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 

    # example passing only required values which don't have defaults set
    try:
        # Used to retrieve a workspace from the repository.
        api_response = api_instance.workspace_id_get(id)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.workspace import Workspace
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 
    workspace = Workspace() # Workspace | The workspace to save.

    # example passing only required values which don't have defaults set
    try:
        # Update a workspace in the repository.
        api_response = api_instance.workspace_id_put(id, workspace)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.workspace import Workspace
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    workspace = Workspace() # Workspace | The Workspace to save.

    # example passing only required values which don't have defaults set
    try:
        # Used to save a Workspace to the repository. The user_id (keycloak user id) will be automatically filled with the current user
        api_response = api_instance.workspace_post(workspace)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 

    # example passing only required values which don't have defaults set
    try:
        # Delete a WorkspaceResource.
        api_instance.workspaceresource_id_delete(id)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.workspace_resource import WorkspaceResource
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 

    # example passing only required values which don't have defaults set
    try:
        # Used to retrieve a WorkspaceResource.
        api_response = api_instance.workspaceresource_id_get(id)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.workspace_resource import WorkspaceResource
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | 
    workspace_resource = WorkspaceResource() # WorkspaceResource | The WorkspaceResource to save.

    # example passing only required values which don't have defaults set
    try:
        # Update the WorkspaceResource.
        api_response = api_instance.workspaceresource_id_put(id, workspace_resource)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.workspace_resource import WorkspaceResource
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    workspace_resource = WorkspaceResource() # WorkspaceResource | The WorkspaceResource to save.

    # example passing only required values which don't have defaults set
    try:
        # Used to save a WorkspaceResource to the repository.
        api_response = api_instance.workspaceresource_post(workspace_resource)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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

# **workspaces_controllers_workspace_controller_addimage**
> workspaces_controllers_workspace_controller_addimage(id)

Adds and image to the workspace.

### Example

* Bearer (JWT) Authentication (bearerAuth):
```python
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | Workspace ID of the workspace
    image = open('/path/to/file', 'rb') # file_type |  (optional)

    # example passing only required values which don't have defaults set
    try:
        # Adds and image to the workspace.
        api_instance.workspaces_controllers_workspace_controller_addimage(id)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->workspaces_controllers_workspace_controller_addimage: %s\n" % e)

    # example passing only required values which don't have defaults set
    # and optional values
    try:
        # Adds and image to the workspace.
        api_instance.workspaces_controllers_workspace_controller_addimage(id, image=image)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->workspaces_controllers_workspace_controller_addimage: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Workspace ID of the workspace |
 **image** | **file_type**|  | [optional]

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
> workspaces_controllers_workspace_controller_import_resources(id)

Imports the ResourceOrigins into the Workspace and creates/updates the workspace resources

### Example

* Bearer (JWT) Authentication (bearerAuth):
```python
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.inline_object import InlineObject
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | Workspace ID of the workspace
    inline_object = InlineObject(
        resourceorigins=[
            ResourceOrigin(),
        ],
    ) # InlineObject |  (optional)

    # example passing only required values which don't have defaults set
    try:
        # Imports the ResourceOrigins into the Workspace and creates/updates the workspace resources
        api_instance.workspaces_controllers_workspace_controller_import_resources(id)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->workspaces_controllers_workspace_controller_import_resources: %s\n" % e)

    # example passing only required values which don't have defaults set
    # and optional values
    try:
        # Imports the ResourceOrigins into the Workspace and creates/updates the workspace resources
        api_instance.workspaces_controllers_workspace_controller_import_resources(id, inline_object=inline_object)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->workspaces_controllers_workspace_controller_import_resources: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Workspace ID of the workspace |
 **inline_object** | [**InlineObject**](InlineObject.md)|  | [optional]

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
> workspaces_controllers_workspace_controller_setthumbnail(id)

Sets the thumbnail of the workspace.

### Example

* Bearer (JWT) Authentication (bearerAuth):
```python
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | Workspace ID of the workspace
    thumb_nail = open('/path/to/file', 'rb') # file_type |  (optional)

    # example passing only required values which don't have defaults set
    try:
        # Sets the thumbnail of the workspace.
        api_instance.workspaces_controllers_workspace_controller_setthumbnail(id)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->workspaces_controllers_workspace_controller_setthumbnail: %s\n" % e)

    # example passing only required values which don't have defaults set
    # and optional values
    try:
        # Sets the thumbnail of the workspace.
        api_instance.workspaces_controllers_workspace_controller_setthumbnail(id, thumb_nail=thumb_nail)
    except workspaces_cli.ApiException as e:
        print("Exception when calling RestApi->workspaces_controllers_workspace_controller_setthumbnail: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Workspace ID of the workspace |
 **thumb_nail** | **file_type**|  | [optional]

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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from workspaces_cli.model.workspace import Workspace
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | Workspace ID of the workspace

    # example passing only required values which don't have defaults set
    try:
        # Clones a workspace
        api_response = api_instance.workspaces_controllers_workspace_controller_workspace_clone(id)
        pprint(api_response)
    except workspaces_cli.ApiException as e:
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
import time
import workspaces_cli
from workspaces_cli.api import rest_api
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = workspaces_cli.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = rest_api.RestApi(api_client)
    id = 1 # int | WorkspaceResource ID of the WorkspaceResource

    # example passing only required values which don't have defaults set
    try:
        # Used to register a WorkspaceResource open action. The WorkspaceResource timestamp last open will be updated
        api_instance.workspaces_controllers_workspace_resource_controller_open(id)
    except workspaces_cli.ApiException as e:
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

