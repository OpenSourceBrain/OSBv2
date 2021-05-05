#!/bin/bash

set -e

# remove the pvc from the path (if it has one)
# and append the folder
export download_path=`echo $shared_directory | cut -d ":" -f 2`/"${folder}"

mkdir -p "${download_path}"
cd "${download_path}"

export filename=`echo "${url##*/}"`

echo GitHub copy "$filename" to "$download_path"
svn export --username "${username}" --password "${password}" --force "${url}" "${download_path}"/"${filename}"

# fix permissions
chown -R 1000:1000 "${download_path}"
