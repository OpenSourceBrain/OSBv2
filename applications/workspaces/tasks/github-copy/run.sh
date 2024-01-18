#!/bin/bash

set -e

# remove the pvc from the path (if it has one)
# and append the folder
export download_path=`echo $shared_directory | cut -d ":" -f 2`/"${folder}"
echo "Download path is ${download_path}"

timestamp="$(date +"%Y%m%d%H%M%S-osbv2")"

mkdir -p "${download_path}"
cd "${download_path}"

echo "GitHub copy $paths to $download_path"
ls -la
echo "Git: fix permissions"
git config --global --add safe.directory "$download_path"
# set username for commit
gituser=$(git config --list | grep user.name)
gitusermail=$(git config --list | grep user.email)


# do the next command only if download path does not exist (initial clone)
if [ ! -d "${download_path}/.git" ]; then
  echo "Git: cloning $branch"
  git clone -n "${url}" --branch $branch "${download_path}"

  # configure OSB user
  git config user.name "OSBv2"
  git config user.email "info@opensourcebrain.org"

  # check is paths has a value. In that case, checkout everything
  if [ -z "$paths" ]; then
      echo "Git: checking out everything"
      git checkout HEAD
  else
      # Split paths by ## and checkout each path
      IFS='\'
      for path in $paths; do
          echo "Git: checking out $path"
          git checkout HEAD "$path"
      done
  fi

  # create new branch, commit there
  git checkout -b "$timestamp"
  git commit -m "osbv2: checked out repository"

  # unset username
  git config user.name ""
  git config user.email ""

# on subsequent updates from same repo
else
  echo "Updating existing repository"
  # configure OSB user
  gituser="$(git config user.name)"
  git config user.name "OSBv2"
  gitemail="$(git config user.email)"
  git config user.email "info@opensourcebrain.org"

  # save state, but do not exit if there's nothing to save
  echo "Git: saving state"
  git commit -a -m "osbv2: saving state at $timestamp" || true

  # do not assume user has left the default remote name as "origin"
  echo "Git: adding remote"
  git remote add "$timestamp" "${url}"
  git fetch "$timestamp" "$branch"

  if [ -z "$paths" ]; then
    echo "Git: checking out everything"
    git checkout $timestamp/$branch -- *
  else
      # Split paths by ## and checkout each path
      IFS='\'
      for path in $paths; do
          echo "Git: checking out $path"
          git checkout $timestamp/$branch -- "$path"
      done
  fi
  git commit -a -m "osbv2: updated state at $timestamp"

  echo "Git: undoing remote/user"
  # remove temporary remote
  git remote remove "$timestamp"
  # reset user
  git config user.name "$gituser"
  git config user.email "$gitemail"
fi


# fix permissions
chown -R 1000:100 "${download_path}"
ls -la
