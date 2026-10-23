# osb_workspaces_api.RunApi

All URIs are relative to *http://localhost/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**run_notebooks**](RunApi.md#run_notebooks) | **POST** /workspace/{id}/run | Run notebooks of a repository on the workspace&#39;s volume (papermill in an Argo task), in the order given, after setting up what the request names (requirements, PYTHONPATH, installs). Returns at once.


# **run_notebooks**
> WorkspaceRunResponse run_notebooks(id, workspace_run_request)

Run notebooks of a repository on the workspace's volume (papermill in an Argo task), in the order given, after setting up what the request names (requirements, PYTHONPATH, installs). Returns at once.

### Example

* Bearer (JWT) Authentication (bearerAuth):
```python
import time
import osb_workspaces_api
from osb_workspaces_api.api import run_api
from osb_workspaces_api.model.workspace_run_request import WorkspaceRunRequest
from osb_workspaces_api.model.workspace_run_response import WorkspaceRunResponse
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = osb_workspaces_api.Configuration(
    host = "http://localhost/api"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = osb_workspaces_api.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with osb_workspaces_api.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = run_api.RunApi(api_client)
    id = 1 # int | Workspace ID of the workspace
    workspace_run_request = WorkspaceRunRequest(
        repo=WorkspaceRunRepo(
            dir="dir_example",
        ),
        setup=WorkspaceRunSetup(
            requirements="requirements_example",
            python_path=[
                "python_path_example",
            ],
            install=[
                "install_example",
            ],
        ),
        notebooks=[
            "notebooks_example",
        ],
        input_dir="input_dir_example",
        output_dir="output_dir_example",
        results=WorkspaceRunResults(
            notebooks="notebooks_example",
            log="log_example",
        ),
        image="image_example",
    ) # WorkspaceRunRequest | The notebooks to run, and the data to run them on.

    # example passing only required values which don't have defaults set
    try:
        # Run notebooks of a repository on the workspace's volume (papermill in an Argo task), in the order given, after setting up what the request names (requirements, PYTHONPATH, installs). Returns at once.
        api_response = api_instance.run_notebooks(id, workspace_run_request)
        pprint(api_response)
    except osb_workspaces_api.ApiException as e:
        print("Exception when calling RunApi->run_notebooks: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Workspace ID of the workspace |
 **workspace_run_request** | [**WorkspaceRunRequest**](WorkspaceRunRequest.md)| The notebooks to run, and the data to run them on. |

### Return type

[**WorkspaceRunResponse**](WorkspaceRunResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**202** | Run submitted. While it runs, GET /workspace/{id} lists the \&quot;Refreshing resources\&quot; placeholder, as for an import. |  -  |
**400** | A path is not inside the workspace, or the request is incomplete. |  -  |
**401** | Missing or invalid token. |  -  |
**403** | Only the workspace&#39;s owner may run in it. |  -  |
**404** | The workspace was not found. |  -  |
**409** | A run is already in progress in this workspace, or its owner has as many runs in progress as their quota allows (quota-ws-open). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

