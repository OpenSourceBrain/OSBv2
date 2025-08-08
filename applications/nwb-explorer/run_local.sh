#!/bin/bash

#docker run -p 8887:8888  --name mynwb mynwbosb
#docker run -it --rm -p 8887:8888 mynwbosb start.sh

#docker run --network host --name mynwb -it /bin/bash -d mynwbosb

docker run --network host  -it --rm  --name mynwb -d mynwbosb

