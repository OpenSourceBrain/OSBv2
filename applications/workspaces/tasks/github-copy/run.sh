#!/bin/bash

set -e

# remove the pvc from the path (if it has one)
# and append the folder
export download_path=`echo $shared_directory | cut -d ":" -f 2`/"${folder}"

mkdir -p "${download_path}"
cd "${download_path}"

export filename=`echo "${url##*/}"`

echo GitHub copy "$filename" to "$download_path"
# do the next command only if download path does not exist
if [ ! -d "${filename}" ]; then
  git clone -n "${url}" --branch $branch "${filename}"
fi

cd "${download_path}"/"${filename}"

git checkout HEAD "${path}"

# fix permissions
chown -R 1000:1000 "${download_path}"
