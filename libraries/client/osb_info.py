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
#v2_or_v2dev = 'v2dev'

# Override if command line args set
if '-v2' in sys.argv:
    v2_or_v2dev = 'v2'
if '-v2dev' in sys.argv:
    v2_or_v2dev = 'v2dev'


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


index = 0
min_index = 0
max_index = 5000

with workspaces_cli.ApiClient(configuration) as api_client:
    api_instance = rest_api.RestApi(api_client)

    #info = api_instance.get_info(uri=dandiset_url, repository_type="dandi")
    found = api_instance.osbrepository_get(q=f"uri__like=/", per_page=100000)
    found_dict = found.to_dict()
    print("Found %i matching %s repositories" %(len(found.osbrepositories), v2_or_v2dev))

    for repo in found.osbrepositories:

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

        index+=1


    print("\nFinished listing %i matching %s repositories" %(len(found.osbrepositories), v2_or_v2dev))

filename = 'cached_info/repos_%s.json'%(v2_or_v2dev)    

strj = json.dumps(found_dict, indent='    ')
with open(filename, "w") as fp:
    fp.write(strj)