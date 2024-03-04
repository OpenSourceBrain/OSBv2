#!/bin/bash

set -e

# remove the pvc from the path (if it has one)
# and append the folder
export download_path=`echo $shared_directory | cut -d ":" -f 2`/"${folder}"

mkdir -p "${download_path}"
cd "${download_path}"

export asset_id=`echo "${url##*/}"`

echo Dandi copy "${url}" to "${download_path}"
dandi download --existing refresh ${url}

# fix permissions
chown -R 1000:100 "${download_path}"
