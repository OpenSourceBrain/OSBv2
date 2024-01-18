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
# set username for commit
git config user.name "OSBv2"
git config user.email "info@opensourcebrain.org"

#
# do the next command only if download path does not exist (initial clone)
if [ ! -d "${download_path}/.git" ]; then
  echo Cloning $branch
  git clone -n "${url}" --branch $branch "${download_path}"
  #
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

  # create new branch, commit there
  git checkout -b "$timestamp"
  git commit -m "osbv2: checked out repository"

# on subsequent updates from same repo
else
  git commit -a -m "osbv2: saving state at $timestamp"

  # do not assume user has left the default remote name as "origin"
  git remote add $timestamp "${url}"
  git fetch $timestamp

  if [ -z "$paths" ]; then
    echo "Checking out everything"
    git checkout $timestamp/$branch -- *
  else
      # Split paths by ## and checkout each path
      IFS='\'
      for path in $paths; do
          echo "Checking out $path"
          git checkout $timestamp "$path"
      done
  fi
  git commit -a -m "osbv2: updated state at $timestamp"
fi

# unset username
git config user.name ""
git config user.email ""

# fix permissions
chown -R 1000:100 "${download_path}"
ls -la
