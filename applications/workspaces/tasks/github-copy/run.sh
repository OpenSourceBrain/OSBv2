#!/bin/bash

set -e

# remove the pvc from the path (if it has one)
# and append the folder
export download_path=`echo $shared_directory | cut -d ":" -f 2`/"${folder}"

timestamp="$(date +"%Y%m%d%H%M%S-osbv2")"

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
else
  # Split paths by ## and checkout each path
  IFS='\'
  for path in $paths; do
    echo "Checking out $path"
    git checkout HEAD "$path"
  done
fi

# set username for commit
git config user.name "OSBv2"
git config user.email "info@opensourcebrain.org"

# create new branch, commit there
git checkout -b "$timestamp"
git commit -m "checked out on osbv2"

# unset username
git config user.name ""
git config user.email ""


# fix permissions
chown -R 1000:100 "${download_path}"
ls -la
