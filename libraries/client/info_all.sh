#!/bin/bash
set -ex

## A script to refresh all the cached info json files

python osbv1_info.py

python osb_info.py
python osb_info.py -v2

python osb_gh_info.py 

python loadddandi.py -dry

python modeldb_info.py