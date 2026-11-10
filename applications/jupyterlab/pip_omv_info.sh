#!/bin/bash
set -e

# A script to print info versions of packages in the JupyterLab container

docker run -t --rm --entrypoint /bin/bash myjlab  -c "pip3 list"
echo "--------------------------------------------------------"
docker run -t --rm --entrypoint /bin/bash myjlab  -c "omv list -V"
