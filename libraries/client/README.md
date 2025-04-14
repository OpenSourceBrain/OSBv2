# Scripts for getting lists of repositories on OSBv2 and associated databases

These scripts can be used to get a cached list of the current repositories on OSBv2 and v2dev, and also keep them up to date with the contents of DANDI, ModelDB, BioModels etc.

0) A GitHub access token must be created so scripts using the python github package can be run.

    Save in `github.auth` locally.
 
1) Update current cached lists:

    ```
    ./info_all.sh -q # Runs a quick check of contents of OSBv1, OSBv2, OSBv2dev, OSB repos on Github & DANDI Archive.
    ./info_all.sh    # Same as above, but with BioModles & ModelDB
    ```

    Contents will be saved in JSON files in `cached_info/`

2) Update an OSBv1 project.

    If there is a new OSBv1 project, which hasn't been added to v2/v2dev, run: 

    ```
    python loadosbv1.py -v2dev -dry # this do a dry run and print info on which projects/repos it still needs to add
    ```

    Get an access token by logging in to v2dev, opening the Web Developer console, loading a page, getting the network access token (e.g. abcxxx123) and using this to add the repo via the api

    ```
    python loadosbv1.py abcxxx123 -v2dev # add new repos

    python osb_info.py -v2dev # regenerate cached list of all repos
    ```

    Then do the same using -v2 for OSBv2. 