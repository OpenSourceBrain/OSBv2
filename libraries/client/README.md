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

