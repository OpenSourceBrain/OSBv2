#!/bin/bash
set -e

# A script to run the NWBE container locally (build it first with ./build_local.sh)

docker run --network host  -it --rm  --name mynwb -d mynwbosb

echo -e "NWBE should shortly be available at: \n\n    http://127.0.0.1:8888/geppetto\n"
echo -e "To stop it, use: ./stop_local.sh\n\nTo see the versions of Python packages in the container, use: ./pip_info.sh\n"

