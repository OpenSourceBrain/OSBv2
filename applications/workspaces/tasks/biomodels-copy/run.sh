#!/bin/bash

set -e

# remove the pvc from the path (if it has one)
# and append the folder
export download_path=`echo $shared_directory | cut -d ":" -f 2`/"${folder}"

timestamp="$(date +"%Y%m%d%H%M%S-biomodels")"

mkdir -p "${download_path}"
cd "${download_path}"

# check is paths has a value, otherwise download the archive and unzip it
# note: we don't use the archive system because the archive is generated on the
# fly and can make us wait for an unspecified amount of time, which tools can't
# work with
# -> left here for completeness
if [ -z "$paths" ]; then
    echo Biomodels downloading archive of "${url}" to "${download_path}"
    # use ..="true" and ..="false" here, otherwise aria2c gets confused
    aria2c --retry-wait=2 --max-tries=5 --timeout=300 --max-concurrent-downloads=5 --max-connection-per-server=5 --allow-overwrite="true" --auto-file-renaming="false" --out="$timestamp.omex" "https://www.ebi.ac.uk/biomodels/model/download/${url}"
    unzip -o "$timestamp.omex" && rm -vf "$timestamp.omex"
else
    touch filelist
    # Split paths by ## and checkout each path
    IFS='\'
    for path in $paths; do
        echo Biomodels copy "${path}" to "${download_path}"
        echo "${path}" >> filelist
    done
    echo Biomodels downloading files
    # Move to temporary directory to rename only the downloaded files.
    # Otherwise we risk renaming all files, even ones where the user has used
    # '+' in the file name explicitly
    tempdir=$(mktemp -d)
    pushd "${tempdir}"
        aria2c --retry-wait=2 --max-tries=5 --input-file=filelist --max-concurrent-downloads=5 --max-connection-per-server=5 --allow-overwrite "true" --auto-file-renaming "false"
        rename -a '+' ' ' *.*
    popd
    mv "${tempdir}/*" .
    # directory should be empty, so rmdir will work
    rmdir "${tempdir}"
    rm filelist -f
fi

# fix permissions
chown -R 1000:100 "${download_path}"
