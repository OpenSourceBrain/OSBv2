# Generate the frontend and backend openapi clients

## Backend:
```
openapi-generator-cli generate -i openapi.yaml -g python-flask -o backend -c config.json
```

## Frontend:
```
openapi-generator-cli generate -i openapi.yaml -g typescript-axios -o rest -c config.json


