######################################################################################
# A script to read the current state of the OSBv2 repos and cache a json file with
# the current contents. Makes it easier to track (small) changes following API calls
######################################################################################

from urllib.request import urlopen
import codecs
import workspaces_cli
from pprint import pprint
from workspaces_cli.api import rest_api, k8s_api
import logging
import datetime
import json
import sys

from workspaces_cli.models import OSBRepository, RepositoryType, Tag, RepositoryContentType
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.

# Take from the accessToken cookie after login
TOKEN = "EDITME"

v2_or_v2dev = 'v2'
v2_or_v2dev = 'v2dev'

# Override if command line args set
if '-v2' in sys.argv:
    v2_or_v2dev = 'v2'
if '-v2dev' in sys.argv:
    v2_or_v2dev = 'v2dev'

print("Retrieving all info on repositories in OSB %s"%v2_or_v2dev)

configuration = workspaces_cli.Configuration(
    host = "https://workspaces.%s.opensourcebrain.org/api"%v2_or_v2dev,
    access_token = TOKEN
)


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


index = 0
min_index = 0
max_index = 5000

with workspaces_cli.ApiClient(configuration) as api_client:
    api_instance = rest_api.RestApi(api_client)

    #info = api_instance.get_info(uri=dandiset_url, repository_type="dandi")
    page = 1
    all_found = []

    while True:
        try:
            print('Checking page %i'%page)
            found = api_instance.osbrepository_get(q=f"uri__like=/", per_page=500, page=page)
            for f in found.osbrepositories:
                all_found.append(f)
            print("Found so far: %i"%len(all_found))
            page+=1
            #if page>3: break
        except:
            print("All done")
            break


    saved_dict = {}
    saved_dict['repositories'] = {}
    ff = {'osbrepositories':[a.to_dict() for a in all_found]}
    found_dict = ff


    print("Found %i matching %s repositories" %(len(all_found), v2_or_v2dev))

    for repo in all_found:

        if index>=min_index and index<max_index:
            id = repo.id
            print("\n============ %i: repository: %i =============="%(index,id))
            print("    %s"%(repo.name))
            if hasattr(repo, "summary") and len(repo.summary)>0:
                print("    %s"%(repo.summary))
            url_info = "    URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%i"%(v2_or_v2dev,id)
            print(url_info)
            found_dict['osbrepositories'][index]['timestamp_updated'] = '---'
            found_dict['osbrepositories'][index]['timestamp_created'] = str(repo.timestamp_created)
            saved_dict['repositories'][repo.id]=found_dict['osbrepositories'][index]

        index+=1


    print("\nFinished listing %i matching %s repositories" %(len(all_found), v2_or_v2dev))

filename = 'cached_info/repos_%s.json'%(v2_or_v2dev)    

strj = json.dumps(saved_dict, indent='    ', sort_keys=True)
with open(filename, "w") as fp:
    fp.write(strj)
