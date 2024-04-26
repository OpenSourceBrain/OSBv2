

# Install OpenAPI Generator
npm install @openapitools/openapi-generator-cli -g 

# Set OpenAPI Generator Version
openapi-generator-cli version-manager set 5.1.0

# Generate OpenAPI Stubs - be in the api directory
if [[ $(pwd) == */applications/workspaces/api ]]; then
	# Generate Backend Stubs
	openapi-generator-cli generate -i openapi.yaml -g python-flask -o ../server -c config.json

	# Since /workspaces/api/openapi.yaml and /workspaces/api/server/workspaces/openapi/openapi.yaml are suppose to be same 
	# we need to copy the generated file to the correct location
	cp openapi.yaml ../server/workspaces/openapi/openapi.yaml

	# Generate Frontend Stubs
	openapi-generator-cli generate -i openapi.yaml -g typescript-fetch -o ../../osb-portal/src/apiclient/workspaces -c config.json

else
	echo "Please run this script from the api directory"
fi

