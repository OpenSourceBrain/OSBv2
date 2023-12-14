from urllib.request import urlopen
import codecs
import workspaces_cli
from pprint import pprint
from workspaces_cli.api import rest_api, k8s_api
import logging
import json
import sys

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

dry_run = False
dry_run = True

configuration = workspaces_cli.Configuration(
    host = "https://workspaces.%s.opensourcebrain.org/api"%v2_or_v2dev,
    access_token = TOKEN
)

user_id = "0103eaaf-6a34-4509-a025-14367a52aa2b" # Padraig
if v2_or_v2dev == 'v2dev':
    user_id = "7089f659-90ad-4ed9-9715-2327f7e2e72f" # Padraig on v2dev

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

index = 0
min_index = 20
max_index = 22

all_updated = []
all_added = []
multi_matches = []

with workspaces_cli.ApiClient(configuration) as api_client:
    api_instance = rest_api.RestApi(api_client)

    def add_dandiset(dandishowcase_entry):
        dandiset_url = dandishowcase_entry['url']
        print("\n================ %i: %s ================"%(index, dandiset_url))
        info = api_instance.get_info(uri=dandiset_url, repository_type="dandi")
        search = f"uri__like={dandiset_url.split('/dandiset/')[1].split('/')[0]}"
        found = api_instance.osbrepository_get(q=search)
        if found.osbrepositories:
            if len(found.osbrepositories) > 1:
                info = "    More than one match for %s (search: %s):\n" % (dandiset_url, search)
                for r in found.osbrepositories:
                    info +="      - URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%i (%s)\n"%(v2_or_v2dev, r.id, r.uri)
                    
                print(info)
                multi_matches.append(info)
                return False
            print("    %s already exists; updating..." % dandiset_url)
            url_info = "    URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%i"%(v2_or_v2dev,  found.osbrepositories[0].id)
            print(url_info)
            all_updated.append(url_info)
            print("    ------------ Current OSB info: ---------")
            print("    %s"%found)
            print("    ------------ DANDI API info: ---------")
            print("    %s"%info)
            print("    ------------ DANDI Showcase info: ---------")
            print("    %s"%dandishowcase_entry)

            tags=[{"tag": tag} for tag in info.tags]

            tags.append({"tag": '%s'%dandishowcase_entry['identifier']})
            if dandishowcase_entry['species']:
                tags.append({"tag": 'species:%s'%dandishowcase_entry['species']})

            print("    ------------ Tags: ---------")
            print("    %s"%tags)
            
            if not dry_run:

                return api_instance.osbrepository_id_put(found.osbrepositories[0].id, OSBRepository(
                    uri=dandiset_url,
                    name=info.name,
                    summary=str(info.summary),
                    tags=tags,
                    default_context=info.contexts[-1],
                    content_types_list=[RepositoryContentType(value="experimental")],
                    content_types="experimental",
                    user_id=user_id,
                    repository_type="dandi",
                    auto_sync=True,

                )
            )
        else:
            print("    Adding %s" % dandiset_url)

            if not dry_run:
                return api_instance.osbrepository_post(OSBRepository(
                    uri=dandiset_url,
                    name=info.name,
                    summary=str(info.summary),
                    tags=[{"tag": tag} for tag in info.tags],
                    default_context=info.contexts[-1],
                    content_types_list=[RepositoryContentType(value="experimental")],
                    content_types="experimental",
                    user_id=user_id,
                    repository_type="dandi",
                    auto_sync=True,
                ))

                url_info = "    URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%i"%(v2_or_v2dev, '???') # found.osbrepositories[0].id)
                print(url_info)
                all_updated.append(url_info)


    for dandishowcase_entry in dandishowcase_info: 
        if index>=min_index and index<max_index:
            if int(dandishowcase_entry['num_files']) < 1: 
                continue
            try:
                added = add_dandiset(dandishowcase_entry)
            except:
                logging.exception("Error adding %s" % dandishowcase_entry['url'])

        index+=1

        # print(added)


print("\nDone! All updated (dry_run: %s):"%dry_run)  
for m in all_updated:
    print(m)
print("\nAll added:")  
for m in all_added:
    print(m)
print("\nMultiple matches found:")  
for m in multi_matches:
    print(m)