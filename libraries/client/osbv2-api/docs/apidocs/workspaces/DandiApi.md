# osbv2_api.workspaces.DandiApi

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_upload_urls**](DandiApi.md#get_upload_urls) | **POST** /dandi/get_upload_urls | Reserve an upload into a dandiset and return presigned part URLs. OSB builds the asset path from the caller&#39;s id.
[**validate_upload**](DandiApi.md#validate_upload) | **POST** /dandi/validate_upload | Complete the multipart upload, validate the blob and register the asset in the dandiset&#39;s draft.


# **get_upload_urls**
> DandiUploadUrlsResponse get_upload_urls(dandi_upload_urls_request)

Reserve an upload into a dandiset and return presigned part URLs. OSB builds the asset path from the caller's id.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.dandi_upload_urls_request import DandiUploadUrlsRequest
from osbv2_api.workspaces.models.dandi_upload_urls_response import DandiUploadUrlsResponse
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
    api_instance = osbv2_api.workspaces.DandiApi(api_client)
    dandi_upload_urls_request = osbv2_api.workspaces.DandiUploadUrlsRequest() # DandiUploadUrlsRequest | The file to upload, and the DANDI deployment and dandiset to upload it into.

    try:
        # Reserve an upload into a dandiset and return presigned part URLs. OSB builds the asset path from the caller's id.
        api_response = api_instance.get_upload_urls(dandi_upload_urls_request)
        print("The response of DandiApi->get_upload_urls:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DandiApi->get_upload_urls: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dandi_upload_urls_request** | [**DandiUploadUrlsRequest**](DandiUploadUrlsRequest.md)| The file to upload, and the DANDI deployment and dandiset to upload it into. | 

### Return type

[**DandiUploadUrlsResponse**](DandiUploadUrlsResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Upload reserved: presigned S3 part URLs the client PUTs to directly, or, when the deployment already holds this content, no parts and the existing blob_id. |  -  |
**400** | A missing or invalid field, or an unknown instance. |  -  |
**401** | Missing or invalid OSB token. |  -  |
**403** | The path does not belong to the caller. |  -  |
**502** | The DANDI deployment refused or failed the call. |  -  |
**503** | Uploads are not available (no key for that user, or Keycloak unreachable). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **validate_upload**
> DandiValidateUploadResponse validate_upload(dandi_validate_upload_request)

Complete the multipart upload, validate the blob and register the asset in the dandiset's draft.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import osbv2_api.workspaces
from osbv2_api.workspaces.models.dandi_validate_upload_request import DandiValidateUploadRequest
from osbv2_api.workspaces.models.dandi_validate_upload_response import DandiValidateUploadResponse
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
    api_instance = osbv2_api.workspaces.DandiApi(api_client)
    dandi_validate_upload_request = osbv2_api.workspaces.DandiValidateUploadRequest() # DandiValidateUploadRequest | The parts the client uploaded, to complete, validate and register as an asset.

    try:
        # Complete the multipart upload, validate the blob and register the asset in the dandiset's draft.
        api_response = api_instance.validate_upload(dandi_validate_upload_request)
        print("The response of DandiApi->validate_upload:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DandiApi->validate_upload: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dandi_validate_upload_request** | [**DandiValidateUploadRequest**](DandiValidateUploadRequest.md)| The parts the client uploaded, to complete, validate and register as an asset. | 

### Return type

[**DandiValidateUploadResponse**](DandiValidateUploadResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Upload completed, validated and registered in the dandiset&#39;s draft. |  -  |
**400** | A missing or invalid field, or an unknown instance. |  -  |
**401** | Missing or invalid OSB token. |  -  |
**403** | The path does not belong to the caller. |  -  |
**502** | The DANDI deployment refused or failed the call. |  -  |
**503** | Uploads are not available (no key for that user, or Keycloak unreachable). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

