# Generate the frontend and backend openapi clients

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


