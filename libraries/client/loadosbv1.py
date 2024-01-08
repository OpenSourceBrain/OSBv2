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

known_ignores = ['dentate','nc_superdeep','tvb_neuroml']

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

index = 0
min_index = 0
max_index = 1000

verbose = True # 
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

filename = 'cached_info/projects_v1.json'
osbv1_info = json.load(open(filename))

print('Loaded info on %s osbv1 projs'%len(osbv1_info))

all_updated = []
all_added = []
multi_matches = []
all_errors = []


with workspaces_cli.ApiClient(configuration) as api_client:
    api_instance = rest_api.RestApi(api_client)

    def add_osbv1_project(osbv1_proj, index):
        osbv1_proj_id = osbv1_proj['identifier']
        if not 'GitHub repository' in osbv1_proj:
            but_ok = ' (but it is in the list of known projects to ignore)' if osbv1_proj_id in known_ignores else ''
            all_errors.append("  %i, %s doesn't have a Github repo%s..."%(index, osbv1_proj_id, but_ok))
            return
        osbv1_github_git = osbv1_proj['GitHub repository']
        osbv1_github = osbv1_github_git.split('.git')[0]

        print("\n================ %i: %s, %s ================\n"%(index, osbv1_proj_id, osbv1_github))
        
        search = f"uri__like={osbv1_github}"

        found = api_instance.osbrepository_get(q=search)

        if found.osbrepositories:
            matching_repos = []
            for r in found.osbrepositories:
                if r.uri==osbv1_github:
                    matching_repos.append("URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%i (%s)\n"%(v2_or_v2dev, r.id, r.uri))
            if len(matching_repos) > 1:
                print('Matching: %s'%matching_repos)
                err_info = "    More than one match for %s (search: %s):\n" % (osbv1_github, search)
                for r in found.osbrepositories:
    
                    err_info +="         - URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%i (%s)\n"%(v2_or_v2dev, r.id, r.uri)
                    err_info +="         - Owner %s\n"%(lookup_user(r.user_id,''))
                    
                print(err_info)
                if verbose:
                    print("\n    ------------ Current OSB %s repo info: ---------" % v2_or_v2dev)
                    print("    %s"%found)
                    print("    ------------ OSB API info: ---------")
                    print("    %s"%osbv1_proj)

                multi_matches.append(err_info)
                return False
            r = found.osbrepositories[0]
            url_info = "    OSBv2 repo: https://%s.opensourcebrain.org/repositories/%i (%s)"%(v2_or_v2dev,  found.osbrepositories[0].id, osbv1_github)
            try:
                print("    %s already exists (owner: %s); updating..." % (osbv1_proj_id, lookup_user(r.user_id, url_info)))
            except:
                exit(-1)
            print(url_info)
            all_updated.append(url_info)

            if verbose:
                print("\n    ------------ Current OSB %s repo info: ---------" % v2_or_v2dev)
                print("    %s"%found)
                print("    ------------ OSB API info: ---------")
                pprint(osbv1_proj)

            tags = get_tags_info(osbv1_info=osbv1_proj)
            
            if not dry_run:

                desc = osbv1_proj['description']
                if 'github:README.md' in desc:
                    desc = ''


                return api_instance.osbrepository_id_put(found.osbrepositories[0].id, OSBRepository(
                    uri=osbv1_github,
                    name=osbv1_proj['name'],
                    summary=desc,
                    tags=tags,
                    default_context=osbv1_proj['main_branch'],
                    content_types_list=[RepositoryContentType(value="modeling")],
                    content_types="modeling",
                    user_id=owner_user_id,
                    repository_type="github",
                    auto_sync=True,

                )
            )
        else:
            print("    Adding %s" % osbv1_github)

            tags = get_tags_info(osbv1_info=osbv1_proj)

            all_added.append("%s, index %i"%(osbv1_github, index))

            if not dry_run:

                desc = osbv1_proj['description']
                if 'github:README.md' in desc:
                    desc = ''

                return api_instance.osbrepository_post(OSBRepository(
                    uri=osbv1_github,
                    name=osbv1_proj['name'],
                    summary=desc,
                    tags=tags,
                    default_context=osbv1_proj['main_branch'],
                    content_types_list=[RepositoryContentType(value="modeling")],
                    content_types="modeling",
                    user_id=owner_user_id,
                    repository_type="github",
                    auto_sync=True,
                ))

            url_info = "    URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%s"%(v2_or_v2dev, '???') # found.osbrepositories[0].id)
            print(url_info)


    for osbv1_proj_id in osbv1_info: 
        osbv1_proj = osbv1_info[osbv1_proj_id]
        if index>=min_index and index<max_index:
            try:
                added = add_osbv1_project(osbv1_proj, index)
            except Exception as e:
                print('----------')
                logging.exception("Error adding %s" % osbv1_proj)
                print('----------')
                print('Error: %s'%str(e))
                print('----------')
                if not 'context_resources' in str(e):
                    print("Exiting due to unknown error...")
                    exit()
                else:
                    print('Known error...')

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

print("\nErrors found (%i total):"%len(all_errors))
for de in all_errors:
    print(de)