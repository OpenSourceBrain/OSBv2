#!/bin/bash

set -e

# remove the pvc from the path (if it has one)
# and append the folder
export download_path=`echo $shared_directory | cut -d ":" -f 2`/"${folder}"

timestamp="$(date +"%Y%m%d%H%M%S-biomodels")"

mkdir -p "${download_path}"
cd "${download_path}"

# if a file url is passed
if echo "${url}" | grep -E "https://" 2>&1 > /dev/null
then
    echo Biomodels copy "${url}" to "${download_path}"
    echo "${url}" > filelist
    aria2c --retry-wait=2 --max-tries=5 --input-file=filelist --max-concurrent-downloads=5 --max-connection-per-server=5 --allow-overwrite "true" --auto-file-renaming "false"
    rm filelist -f
else
    # if the model id is passed, downloads the OMEX archive and unzips it
    echo Biomodels copy all files of article "${url}" to "${download_path}"
    # use ..="true" and ..="false" here, otherwise aria2c gets confused
    aria2c --retry-wait=2 --max-tries=5 --max-concurrent-downloads=5 --max-connection-per-server=5 --allow-overwrite="true" --auto-file-renaming="false" --out="$timestamp.omex" "https://www.ebi.ac.uk/biomodels/model/download/${url}"
    unzip -o "$timestamp.omex" && rm -f "$timestamp.omex"
fi


# fix permissions
chown -R 1000:100 "${download_path}"
