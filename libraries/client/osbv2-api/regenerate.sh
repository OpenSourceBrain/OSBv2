#!/usr/bin/env bash
# Regenerate the workspaces_cli Python client from the OpenAPI specification.
# Requires the OpenAPI Generator CLI (https://openapi-generator.tech).

set -euo pipefail


# the package directory
OSB_API_PKG_SRC_DIR="libraries/client/osbv2-api/"

# the folder for the
OSB_API_MODULE_DIR="$OSB_API_PKG_SRC_DIR/osbv2_api/"

if [ -d ".git" ]
then
    echo ">>> Generating workspaces Python client"
    openapi-generator-cli generate \
      -i applications/workspaces/api/openapi.yaml \
      -g python \
      -o $OSB_API_MODULE_DIR \
      --additional-properties=library=urllib3 \
      --additional-properties=packageName=workspaces \
      --additional-properties=sourceFolder="." \
      --additional-properties=packageVersion=1.0.0 \
      --additional-properties=buildSystem=setuptools \
      --additional-properties=generateSourceCodeOnly=true

    pushd $OSB_API_PKG_SRC_DIR || exit 1

    echo ">>> Moving workspaces tests to top level test folder"
    mv osbv2_api/workspaces/test tests/workspaces/ -v

    echo ">>> Moving workspaces docs to top level test folder"
    mv osbv2_api/workspaces/docs docs/apidocs/workspaces/ -v

else
    echo "Must be run from project root (where .git resides)"
    exit 1
fi

