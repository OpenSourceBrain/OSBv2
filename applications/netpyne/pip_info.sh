#!/bin/bash
set -e

# A script to print info versions of packages in the NetPyNE container

docker run -t --rm --entrypoint /bin/bash mynetpyneosb  -c "pip3 list && python -V"
