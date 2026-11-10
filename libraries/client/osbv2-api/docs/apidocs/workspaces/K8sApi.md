# osbv2_api.workspaces.K8sApi

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**live**](K8sApi.md#live) | **GET** /live | Test if application is healthy
[**ready**](K8sApi.md#ready) | **GET** /ready | Test if application is ready to take requests


# **live**
> str live()

Test if application is healthy

### Example


```python
import osbv2_api.workspaces
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
    api_instance = osbv2_api.workspaces.K8sApi(api_client)

    try:
        # Test if application is healthy
        api_response = api_instance.live()
        print("The response of K8sApi->live:\n")
        pprint(api_response)
    except Exception as e:
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
import osbv2_api.workspaces
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
    api_instance = osbv2_api.workspaces.K8sApi(api_client)

    try:
        # Test if application is ready to take requests
        api_response = api_instance.ready()
        print("The response of K8sApi->ready:\n")
        pprint(api_response)
    except Exception as e:
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

