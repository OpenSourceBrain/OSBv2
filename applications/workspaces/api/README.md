# Generate the frontend and backend openapi clients

You can use the script `generate_openapi_stubs.sh` to generate the openapi stubs for the frontend and backend. Ensure you are in the right directory and run the script.

## Set openapi version

```
openapi-generator-cli version-manager set 5.1.0
```

## Backend:
```
openapi-generator-cli generate -i openapi.yaml -g python-flask -o ../server -c config.json
```

## Frontend:
```
openapi-generator-cli generate -i openapi.yaml -g typescript-fetch -o ../../osb-portal/src/apiclient/workspaces -c config.json


