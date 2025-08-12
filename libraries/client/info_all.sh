#!/bin/bash
set -ex

## A script to refresh all the cached info json files

quick=0

if [[ ($# -eq 1) && ($1 == '-q') ]]; then
    quick=1
fi

ruff format *.py
ruff check  *.py

# Update the cached info for OSBv1
python osbv1_info.py
if [ "$quick" == 0 ]; then
    echo "Testing OSBv1 loading on v2dev..."
    python loadosbv1.py -v2dev -dry
fi

# Update the cached info for OSB projects on GitHub
python osb_gh_info.py 
 
# Update the cached info for OSBv2 repositories
python osb_info.py -v2dev
python osb_info.py -v2



if [ "$quick" == 0 ]; then

    python loadddandi.py -dry
    
    python biomodels_info.py 

    python modeldb_info.py

fi
