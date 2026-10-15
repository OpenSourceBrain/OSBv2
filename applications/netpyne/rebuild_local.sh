#!/bin/bash
set -e

time DOCKER_BUILDKIT=1 docker build -t mynetpyneosb -f Dockerfile --no-cache .
