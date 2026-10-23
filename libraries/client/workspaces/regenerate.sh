#!/usr/bin/env bash
# Regenerate the workspaces_cli Python client from the OpenAPI specification.
# Requires the OpenAPI Generator CLI (https://openapi-generator.tech).

set -euo pipefail

echo "To be run from project root"

openapi-generator-cli generate \
  -i applications/workspaces/api/openapi.yaml \
  -g python \
  -o libraries/client/workspaces/ \
  --package-name osb_workspaces_api \
  --additional-properties=packageVersion=1.0.0
