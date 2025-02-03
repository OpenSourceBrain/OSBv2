from urllib.request import urlopen
import codecs
import workspaces_cli
from pprint import pprint
from workspaces_cli.api import rest_api, k8s_api
import logging
import json
import sys

from utils import get_tags_info
from utils import known_users, lookup_user

from workspaces_cli.models import OSBRepository, RepositoryType, Tag, RepositoryContentType
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.

# Take from the accessToken cookie after login
TOKEN = "EDITME"
if len(sys.argv) >1:
    TOKEN = sys.argv[1]

v2_or_v2dev = 'v2'
v2_or_v2dev = 'v2dev'

# Override if command line args set
if '-v2' in sys.argv:
    v2_or_v2dev = 'v2'
if '-v2dev' in sys.argv:
    v2_or_v2dev = 'v2dev'


if '-dry' in sys.argv:
    dry_run = True
else:
    dry_run = False # dry_run = True



known_missing_dandisets = ['https://dandiarchive.org/dandiset/000069/draft',
                           'https://dandiarchive.org/dandiset/000477/draft',
                           'https://dandiarchive.org/dandiset/000561/draft']

index = 0
min_index = 0
max_index = 10

verbose = False

configuration = workspaces_cli.Configuration(
    host = "https://workspaces.%s.opensourcebrain.org/api"%v2_or_v2dev,
    access_token = TOKEN
)

owner_user_id = known_users['OSBAdmin_v2']
if v2_or_v2dev == 'v2dev':
    owner_user_id = known_users['OSBAdmin_v2dev']

# Enter a context with an instance of the API client
with workspaces_cli.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = k8s_api.K8sApi(api_client)
    
    try:
        # Test if application is healthy
        api_response = api_instance.live()
        pprint(api_response)
    except workspaces_cli.ApiException as e:
        print("Exception when calling K8sApi->live: %s\n" % e)

dandishowcase_csv_url = "https://raw.githubusercontent.com/OpenSourceBrain/DANDIArchiveShowcase/main/validation_folder/dandiset_summary.csv"
response = urlopen(dandishowcase_csv_url)

import csv 
dandishowcase_info_reader = csv.DictReader(codecs.iterdecode(response, "utf-8"))
dandishowcase_info = list(dandishowcase_info_reader)

filename = 'cached_info/dandishowcase_info.json'   

strj = json.dumps(dandishowcase_info, indent='    ', sort_keys=True)
with open(filename, "w") as fp:
    fp.write(strj)


all_updated = []
all_added = []
multi_matches = []
dandi_errors = []


with workspaces_cli.ApiClient(configuration) as api_client:
    api_instance = rest_api.RestApi(api_client)

    def add_dandiset(dandishowcase_entry, index):
        dandiset_url = dandishowcase_entry['url']
        print("\n================ %i: %s ================\n"%(index, dandiset_url))
        try:
            dandi_api_info = api_instance.get_info(uri=dandiset_url, repository_type="dandi")
        except: 
            but_ok = ' (known to be missing...)' if dandiset_url in known_missing_dandisets else ''
            err_info = 'Problem accessing %s%s'%(dandiset_url, but_ok)
            print(err_info)
            dandi_errors.append(err_info)
            return
        search = f"uri__like={dandiset_url.split('/dandiset/')[1].split('/')[0]}"
        found = api_instance.osbrepository_get(q=search)

        if found.osbrepositories:
            matching_repos = []
            for r in found.osbrepositories:
                if r.uri==dandiset_url:
                    matching_repos.append("URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%i (%s)\n"%(v2_or_v2dev, r.id, r.uri))
            if len(matching_repos) > 1:
                print('     *** Matching: %s'%matching_repos)
                err_info = "    More than one match for %s (search: %s):\n" % (dandiset_url, search)
                for r in found.osbrepositories:
    
                    err_info +="         - URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%i (%s)\n"%(v2_or_v2dev, r.id, r.uri)
                    err_info +="         - Owner %s\n"%(lookup_user(r.user_id,''))
                    
                print(err_info)
                if verbose:
                    print("\n    ------------ Current OSB %s repo info: ---------" % v2_or_v2dev)
                    print("    %s"%found)
                    print("    ------------ DANDI API info: ---------")
                    print("    %s"%dandi_api_info)
                multi_matches.append(err_info)
                return False
            r = found.osbrepositories[0]
            url_info = "    URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%i"%(v2_or_v2dev,  found.osbrepositories[0].id)
            try:
                print("    %s already exists (owner: %s); updating..." % (dandiset_url, lookup_user(r.user_id, url_info)))
            except:
                exit(-1)
            print(url_info)
            all_updated.append(url_info)

            if verbose:
                print("\n    ------------ Current OSB %s repo info: ---------" % v2_or_v2dev)
                print("    %s"%found)
                print("    ------------ DANDI API info: ---------")
                print("    %s"%dandi_api_info)
                print("    ------------ DANDI Showcase info: ---------")
                print("    %s"%dandishowcase_entry)

            tags = get_tags_info(dandi_api_info=dandi_api_info, dandishowcase_info=dandishowcase_entry)
            
            if not dry_run:

                return api_instance.osbrepository_id_put(found.osbrepositories[0].id, OSBRepository(
                    uri=dandiset_url,
                    name=dandi_api_info.name,
                    summary=str(dandi_api_info.summary),
                    tags=tags,
                    default_context=dandi_api_info.contexts[-1],
                    content_types_list=[RepositoryContentType(value="experimental")],
                    content_types="experimental",
                    user_id=owner_user_id,
                    repository_type="dandi",
                    auto_sync=True,

                )
            )
        else:
            print("    Adding %s" % dandiset_url)

            tags = get_tags_info(dandi_api_info=dandi_api_info, dandishowcase_info=dandishowcase_entry)

            all_added.append("%s, index %i"%(dandiset_url, index))

            if not dry_run:
                return api_instance.osbrepository_post(OSBRepository(
                    uri=dandiset_url,
                    name=dandi_api_info.name,
                    summary=str(dandi_api_info.summary),
                    tags=tags,
                    default_context=dandi_api_info.contexts[-1],
                    content_types_list=[RepositoryContentType(value="experimental")],
                    content_types="experimental",
                    user_id=owner_user_id,
                    repository_type="dandi",
                    auto_sync=True,
                ))

            url_info = "    URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%s"%(v2_or_v2dev, '???') # found.osbrepositories[0].id)
            print(url_info)


    for dandishowcase_entry in dandishowcase_info: 
        if index>=min_index and index<max_index:
            if int(dandishowcase_entry['num_files']) < 1: 
                continue
            try:
                added = add_dandiset(dandishowcase_entry, index)
            except Exception as e:
                logging.exception("Error adding/updating %s" % dandishowcase_entry['url'])
                #exit()

        index+=1

        # print(added)


print("\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"+
      "\n\nDone! All updated (%i total; dry_run: %s):"%(len(all_updated),dry_run))
for m in all_updated:
    print(m)

print("\nAll added (%i total):"%len(all_added))  
for m in all_added:
    print(m)

print("\nMultiple matches found (%i total):"%len(multi_matches))
for m in multi_matches:
    print(m)

print("\nErrors found (%i total):"%len(dandi_errors))
for de in dandi_errors:
    print(de)