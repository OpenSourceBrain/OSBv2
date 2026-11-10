#!/bin/bash
set -e

# A script to run the JupyterLab container locally (build it first with ./build_local.sh)

docker run --network host -it --rm  --name myjupyterlab myjlab 


