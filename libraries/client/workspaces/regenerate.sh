#!/usr/bin/env bash
# Regenerate the workspaces_cli Python client from the OpenAPI specification.
# Requires the OpenAPI Generator CLI (https://openapi-generator.tech).

set -euo pipefail

openapi-generator-cli generate \
  -i applications/workspaces/api/openapi.yaml \
  -g python \
  -o . \
  --package-name workspaces_cli \
  --additional-properties=packageVersion=1.0.0
