#!/bin/bash

set -e

# remove the pvc from the path (if it has one)
# and append the folder
export download_path=`echo $shared_directory | cut -d ":" -f 2`/"${folder}"

mkdir -p "${download_path}"
cd "${download_path}"

# if a file url is passed
if echo "${url}" | grep -E "https://" 2>&1 > /dev/null
then
    echo Figshare copy "${url}" to "${download_path}"
    echo "${url}" > filelist
else
    # if the article id is passed, download all files
    echo Figshare copy all files of article "${url}" to "${download_path}"
    curl -X GET "https://api.figshare.com/v2/articles/${url}/files" | tr "}" "\n" | grep -Eo "https://ndownloader.figshare.com/files/[[:digit:]]+" > filelist
fi

# multiple downloads concurrently, with multiple connections to the server
# overwrite files if they are downloaded again
aria2c --retry-wait=2 --max-tries=5 --input-file=filelist --max-concurrent-downloads=5 --max-connection-per-server=5 --allow-overwrite "true" --auto-file-renaming "false"

# delete the file list
rm filelist -f

# fix permissions
chown -R 1000:100 "${download_path}"
