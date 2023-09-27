from urllib.request import urlopen
import codecs
import workspaces_cli
from pprint import pprint
from workspaces_cli.api import rest_api, k8s_api
import logging

from workspaces_cli.models import OSBRepository, RepositoryType, Tag, RepositoryContentType
# Defining the host is optional and defaults to http://localhost/api
# See configuration.py for a list of all supported configuration parameters.

# Take from the accessToken coookie after login
TOKEN = "EDITME"

configuration = workspaces_cli.Configuration(
    host = "https://workspaces.v2.opensourcebrain.org/api",
    access_token = TOKEN
)

user_id = "0103eaaf-6a34-4509-a025-14367a52aa2b" # Padraig

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

dandi_csv_url = "https://raw.githubusercontent.com/OpenSourceBrain/DANDIArchiveShowcase/main/validation_folder/dandiset_summary.csv"
response = urlopen(dandi_csv_url)

import csv 
cr = csv.DictReader(codecs.iterdecode(response, "utf-8"))

with workspaces_cli.ApiClient(configuration) as api_client:
    api_instance = rest_api.RestApi(api_client)
    def add_dandiset(dandiset_url):
        info = api_instance.get_info(uri=dandiset_url, repository_type="dandi")
        found = api_instance.osbrepository_get(q=f"uri__like={dandiset_url.split('/dandiset/')[1].split('/')[0]}")
        if found.osbrepositories:
            if len(found.osbrepositories) > 1:
                print("More than one match for %s" % dandiset_url)
                return False
            print("%s already exists; updating" % dandiset_url)
            return api_instance.osbrepository_id_put(found.osbrepositories[0].id, OSBRepository(
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

            )
            )
        print("Adding %s" % dandiset_url)
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


    next(cr)
    for row in cr: 
        if int(row['num_files']) < 1: 
            continue
        try:
            added = add_dandiset(row['url'])
        except:
            logging.exception("Error adding %s" % row['url'])



        # print(added)
        