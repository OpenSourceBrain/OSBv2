# Scripts for getting lists of repositories on OSBv2 and associated databases

These scripts can be used to get a cached list of the current repositories on OSBv2 and v2dev, and also keep them up to date with the contents of DANDI, ModelDB, BioModels etc.

## Requirement

A GitHub access token must be created so scripts using the python `github` package can be run.

Save in `github.auth` locally.
 
## Update all current cached lists

Run: 

```
./info_all.sh -q # Runs a quick check of contents of OSBv1, OSBv2, OSBv2dev, OSB repos on Github & DANDI Archive.
./info_all.sh    # Same as above, but with BioModels & ModelDB
```

Contents of these caches will be saved in JSON files in `cached_info/`

## Step by step guide to the individual caches

### 1) Checking/updating OSBv1 projects

The following command will regenerate the cached list of current OSBv1 projects using the [OSBv1 API](https://github.com/OpenSourceBrain/OSB_API):

```
python osbv1_info.py
```

It saves the list to `cached_info/projects_v1.json`.

If there has been a new project created on OSBv1 recently (and so the json cache has changed), which hasn't been added to v2/v2dev, run: 

```
python loadosbv1.py -v2dev -dry # this does a dry run and prints info on which projects/repos it still needs to add
```

Get an access token by logging in to http://v2dev.opensourcebrain.org, opening the Web Developer console, loading a page, copying the network access token (e.g. abcxxx123) and using this to add the repo via the api:

```
python loadosbv1.py abcxxx123 -v2dev # add new repos

python osb_info.py -v2dev # regenerate cached list of all OSBv2 repos
```

Then do the same using `-v2` instead of for `-v2dev` for the live version of OSBv2 (it will be a different access token...). 

### 2) Checking/updating the cached info for OSB projects on GitHub

This will generate a cached list of all repositories under https://github.com/opensourcebrain into `cached_info/osb_gh.json`. Note: most (~2K) of these are forks of ModelDB GitHub repos, many of the rest are repos which were used on OSBv1.

```
python osb_gh_info.py 
```

### 3) Checking/updating ModelDB content

This will get a structured json file (`cached_info/modeldb.json`) of the contents of the ModelDB archive (note full check can take up to 1hr):
```
python modeldb_info.py
```
If it is reporting that there are ModelDB entries yet to be forked, run:
```
python modeldb_info.py -fork
```
This will create a fork of the ModelDB repository (e.g. https://github.com/ModelDBRepository/2018247) on the OSB GitHub organisation (e.g. https://github.com/OpenSourceBrain/2018247)

Now run: 
```
python osb_gh_info.py 
```
again to see this (the new repository will be added to the cache). 

Now we need to create an OSBv2 repository pointing to this repo on https://github.com/OpenSourceBrain:
```
python loadmodeldb.py -dry -v2dev       # dry run to test/list repos to add
python loadmodeldb.py abcxxx123 -v2dev  # add new repos to v2dev using the token as above...
python osb_info.py -v2dev               # regenerate the cache of all osbv2 dev repos
```
When this works, do the same with `-v2` for the live OSBv2. 

### 4) Checking/updating BioModels content

This will get a structured json file (`cached_info/biomodels.json`) of the contents of the BioModels archive (note full check can take up to 30 mins):
```
python biomodels_info.py
```

Now we need to test if there is an OSBv2 repository pointing to each of these BioModels models:
```
python loadbiomodels.py -dry -v2dev       # dry run to test/list repos to add
```

If they need to be added, run:
```
python loadbiomodels.py abcxxx123 -v2dev  # add new repos to v2dev using the token as above...
python osb_info.py -v2dev                 # regenerate the cache of all osbv2 dev repos
```
When this works, do the same with `-v2` for the live OSBv2. 


### 4) Checking/updating DANDI Archive content

This will get a structured json file (`cached_info/dandiarchive.json`) of the contents of the DANDI Archive (note full check can take up to 10 mins):
```
python dandi_info.py
```

Now we need to test if there is an OSBv2 repository pointing to each of these DANDI datasets:
```
python loaddandi.py -dry -v2dev       # dry run to test/list repos to add
```

If they need to be added, run:
```
python loaddandi.py abcxxx123 -v2dev  # add new repos to v2dev using the token as above...
python osb_info.py -v2dev                 # regenerate the cache of all osbv2 dev repos
```
When this works, do the same with `-v2` for the live OSBv2. 
