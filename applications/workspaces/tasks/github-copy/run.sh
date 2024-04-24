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

# do the next command only if download path does not exist (initial clone)
if [ ! -d "${download_path}/.git" ]; then
  echo "Git: cloning new repository branch: $branch"
  git clone -n "${url}" --branch $branch "${download_path}"

  # configure OSB user for this clone
  echo "Git: setting user/email to OSBv2 for new repo"
  git config user.name "OSBv2"
  git config user.email "info@opensourcebrain.org"

  # check is paths has a value, otherwise check out everything
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
  echo "Git: checking out new branch and committing"
  git checkout -b "$timestamp"
  echo "checked out branch $timestamp"
 
  # unset username: ensure that user has to set it manually if they
  # do anything with git in the repo
  echo "Git: unsetting user/email for repo"
  git config --unset user.name
  git config --unset user.email

# on subsequent updates from same repo
else
  echo "Updating existing repository"
  # configure OSB user
  echo "Git: saving current git user/email and setting to OSBv2"
  gituser="$(git config user.name)" || true
  git config user.name "OSBv2"
  gitemail="$(git config user.email)" || true
  git config user.email "info@opensourcebrain.org"

  # save state, but do not error if there's nothing to save
  echo "Git: saving current state"
  git diff-index --quiet HEAD || git commit -a -m "osbv2: saving state at $timestamp" || true

  # do not assume user has left the default remote name as "origin"
  echo "Git: adding and fetching from temporary remote"
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
  # save new state but do not error if nothing changed
  echo "Git: saving new state"
  git diff-index --quiet HEAD || git commit -a -m "osbv2: updated state at $timestamp" || true

  echo "Git: removing temporary remote"
  # remove temporary remote
  git remote remove "$timestamp"

  # reset user to whatever it was before
  # setting to "" is not the same as unsetting
  # git still adds an entry to the config file
  echo "Git: resetting user/email"
  if [ -z "$gituser" ]
  then
    git config --unset user.name
  else
    git config user.name "$gituser"
  fi

  if [ -z "$gitemail" ]
  then
    git config --unset user.email
  else
    git config user.name "$gitemail"
  fi
fi


# fix permissions
echo "Fixing permissions on download path"
chown -R 1000:100 "${download_path}"
ls -la
