#!/bin/bash

set -e

# remove the pvc from the path (if it has one)
# and append the folder
export download_path=`echo $shared_directory | cut -d ":" -f 2`/"${folder}"

mkdir -p "${download_path}"
cd "${download_path}"

echo GitHub copy "$paths" to "$download_path"
ls -la
echo "Fix permissions"
git config --global --add safe.directory "$download_path"
# do the next command only if download path does not exist
if [ ! -d "${download_path}/.git" ]; then
  echo Cloning $branch
  git clone -n "${url}" --branch $branch "${download_path}"
fi

# check is paths has a value. In that case, checkout everything
if [ -z "$paths" ]; then
  echo "Checking out everything"
  git checkout HEAD
  exit 0
else
  # Split paths by ## and checkout each path
  IFS='\'
  for path in $paths; do
    echo "Checking out $path"
    git checkout HEAD "$path"
  done
fi
# fix permissions
chown -R 1000:100 "${download_path}"
ls -la