#!/bin/bash
set -e

# A script to print info versions of packages in the NWBE container

docker run -t --rm --entrypoint /bin/bash mynwbosb  -c "pip freeze && python -V"
