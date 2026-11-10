#!/bin/bash
set -e

# Set the platform flag if we're on ARM
arch=$(uname -m)
if [[ "$arch" == "arm64" || "$arch" == "aarch64" ]]; then
    platform_flag="--platform linux/amd64"
else
    platform_flag=""
fi

time DOCKER_BUILDKIT=1 docker build $platform_flag -t mynwbosb -f Dockerfile .
