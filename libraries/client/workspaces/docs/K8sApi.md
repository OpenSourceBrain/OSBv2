# workspaces_cli.K8sApi

All URIs are relative to *http://localhost/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**live**](K8sApi.md#live) | **GET** /live | Test if application is healthy
[**ready**](K8sApi.md#ready) | **GET** /ready | Test if application is ready to take requests


# **live**
> str live()

Test if application is healthy

### Example

```python
import time
import workspaces_cli
from workspaces_cli.api import k8s_api
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)


# Enter a context with an instance of the API client
with workspaces_cli.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = k8s_api.K8sApi(api_client)

    # example, this endpoint has no required or optional parameters
    try:
        # Test if application is healthy
        api_response = api_instance.live()
        pprint(api_response)
    except workspaces_cli.ApiException as e:
        print("Exception when calling K8sApi->live: %s\n" % e)
```


### Parameters
This endpoint does not need any parameter.

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
**200** | Healthy |  -  |
**500** | Application is not healthy |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ready**
> str ready()

Test if application is ready to take requests

### Example

```python
import time
import workspaces_cli
from workspaces_cli.api import k8s_api
from pprint import pprint
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.
configuration = workspaces_cli.Configuration(
    host = "http://localhost/api"
)


# Enter a context with an instance of the API client
with workspaces_cli.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = k8s_api.K8sApi(api_client)

    # example, this endpoint has no required or optional parameters
    try:
        # Test if application is ready to take requests
        api_response = api_instance.ready()
        pprint(api_response)
    except workspaces_cli.ApiException as e:
        print("Exception when calling K8sApi->ready: %s\n" % e)
```


### Parameters
This endpoint does not need any parameter.

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
**200** | Ready |  -  |
**500** | Application is not ready yet |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

