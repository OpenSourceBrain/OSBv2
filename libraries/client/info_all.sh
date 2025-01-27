#!/bin/bash
set -ex

## A script to refresh all the cached info json files

quick=0

if [[ ($# -eq 1) && ($1 == '-q') ]]; then
    quick=1
fi

ruff format *.py
ruff check  *.py

python osbv1_info.py

python osb_info.py -v2dev
python osb_info.py -v2

python osb_gh_info.py 

python loadddandi.py -dry

if [ "$quick" == 0 ]; then

    python biomodels_info.py 

    python modeldb_info.py

fi
