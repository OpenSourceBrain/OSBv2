import workspaces_cli
from pprint import pprint, pformat
from workspaces_cli.api import rest_api, k8s_api
import logging
import json
import sys

from utils import get_tags_info
from utils import known_users, lookup_user

from workspaces_cli.models import (
    OSBRepository,
    RepositoryContentType,
)

# Take from the accessToken cookie after login
TOKEN = "EDITME"
if len(sys.argv) > 1:
    TOKEN = sys.argv[1]

v2_or_v2dev = "v2"
v2_or_v2dev = "v2dev"

# Override if command line args set
if "-v2" in sys.argv:
    v2_or_v2dev = "v2"
if "-v2dev" in sys.argv:
    v2_or_v2dev = "v2dev"

if "-dry" in sys.argv:
    dry_run = True
else:
    dry_run = False  # dry_run = True

BIOMODELS_URL: str = "https://www.ebi.ac.uk/biomodels"

index = 0
min_index = 0
max_index = 10000

verbose = True  #
verbose = False

configuration = workspaces_cli.Configuration(
    host="https://workspaces.%s.opensourcebrain.org/api" % v2_or_v2dev,
    access_token=TOKEN,
)

owner_user_id = known_users["OSBAdmin_v2"]
if v2_or_v2dev == "v2dev":
    owner_user_id = known_users["OSBAdmin_v2dev"]

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

filename = "cached_info/biomodels.json"
biomodels_info = json.load(open(filename))
biomodels_info.pop("0", None)

print("Loaded info on %s biomodels models" % len(biomodels_info))

all_updated = []
all_added = []
multi_matches = []
all_errors = []


with workspaces_cli.ApiClient(configuration) as api_client:
    api_instance = rest_api.RestApi(api_client)

    def add_biomodels_model(biomodels_model, index):
        if "publicationId" not in biomodels_model:
            print("Not adding, probably uncurated entry...")
            return False

        if biomodels_model["curationStatus"] != "CURATED":
            print(
                "  Not adding, as curationStatus = %s"
                % biomodels_model["curationStatus"]
            )
            return False
        biomodels_model_id = biomodels_model["publicationId"]
        name = biomodels_model["name"]

        print(
            "\n================ %i: %s, %s ================\n"
            % (index, biomodels_model_id, name)
        )

        biomodels_uri = f"{BIOMODELS_URL}/{biomodels_model_id}"
        search = f"uri__like={biomodels_uri}"

        found = api_instance.osbrepository_get(q=search)

        if found.osbrepositories:
            matching_repos = []
            matches = []

            for r in found.osbrepositories:
                if r.uri == biomodels_uri:
                    matching_repos.append(
                        "M: URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%i (%s) - %s\n"
                        % (v2_or_v2dev, r.id, r.uri, biomodels_uri)
                    )
                    matches.append(r)

            if len(matching_repos) > 1:
                print("Matching: %s" % matching_repos)
                err_info = "    More than one match for [%s] (search: %s):\n" % (
                    biomodels_uri,
                    search,
                )
                for r in found.osbrepositories:
                    err_info += (
                        "         - URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%i (%s)\n"
                        % (v2_or_v2dev, r.id, r.uri)
                    )
                    err_info += "         - Owner %s\n" % (lookup_user(r.user_id, ""))

                print(err_info)
                exit()
                if verbose:
                    print(
                        "\n    ------------ Current OSB %s repo info: ---------"
                        % v2_or_v2dev
                    )
                    print("    %s" % found)
                    print("    ------------ OSB API info: ---------")
                    print("    %s" % biomodels_model)

                multi_matches.append(err_info)
                return False

            existing_repo = matches[0]
            url_info = (
                "    URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%i"
                % (v2_or_v2dev, existing_repo.id)
            )
            try:
                print(
                    "    %s already exists (owner: %s); updating..."
                    % (biomodels_model_id, lookup_user(existing_repo.user_id, url_info))
                )
            except Exception:
                exit(-1)
            print(url_info)
            all_updated.append(url_info)

            if verbose:
                print(
                    "\n    ------------ Current OSB %s repo info: ---------"
                    % v2_or_v2dev
                )
                print("    %s" % found)
                print("    ------------ OSB API info: ---------")
                print("    %s" % biomodels_model)

            tags = get_tags_info(biomodels_info=biomodels_model)

            if not dry_run:
                desc = biomodels_model["description"]
                print("    Description: %s..." % desc[:150])
                latest_version = biomodels_model["history"]["revisions"][-1]
                print("    Latest version: %s" % latest_version)

                return api_instance.osbrepository_id_put(
                    existing_repo.id,
                    OSBRepository(
                        uri=biomodels_uri,
                        name=name,
                        summary=desc,
                        tags=tags,
                        default_context=existing_repo.default_context,
                        content_types_list=[RepositoryContentType(value="modeling")],
                        content_types="modeling",
                        user_id=owner_user_id,
                        repository_type="biomodels",
                        auto_sync=True,
                    ),
                )
        else:
            print(f"Search failed: {search}")
            print(
                "    **********************************************************************"
            )
            print("    ****  Adding %s: %s" % (biomodels_model_id, name))
            print(
                "    **********************************************************************"
            )

            tags = get_tags_info(biomodels_info=biomodels_model)

            all_added.append("  %i) %s: %s" % (index, biomodels_model_id, name))
            desc = biomodels_model["description"]
            print("    Description: %s..." % desc[:150])
            latest_version = biomodels_model["history"]["revisions"][-1]
            print("    Latest version: %s" % latest_version)

            if not dry_run:
                return api_instance.osbrepository_post(
                    OSBRepository(
                        uri=biomodels_uri,
                        name=name,
                        summary=desc,
                        tags=tags,
                        default_context=str(latest_version["version"]),
                        content_types_list=[RepositoryContentType(value="modeling")],
                        content_types="modeling",
                        user_id=owner_user_id,
                        repository_type="biomodels",
                        auto_sync=True,
                    )
                )

            url_info = (
                "    URL to OSBv2 repo: https://%s.opensourcebrain.org/repositories/%s"
                % (v2_or_v2dev, "???")
            )  # found.osbrepositories[0].id)
            print(url_info)

    for biomodels_model_id in biomodels_info:
        biomodels_model = biomodels_info[biomodels_model_id]
        if index >= min_index and index < max_index:
            try:
                added = add_biomodels_model(biomodels_model, index)
            except Exception as e:
                print("----------")
                logging.exception("Error adding %s" % pformat(biomodels_model))
                print("----------")
                print("Error: %s" % str(e))
                print("----------")
                if "context_resources" not in str(e):
                    print("Exiting due to unknown error...")
                    exit()
                else:
                    print("Known error...")

        index += 1

        # print(added)

print(
    "\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
    + "\n\nDone! All updated (%i total; dry_run: %s):" % (len(all_updated), dry_run)
)
for m in all_updated:
    print(m)

print("\nAll added (%i total):" % len(all_added))
for m in all_added:
    print(m)

print("\nMultiple matches found (%i total):" % len(multi_matches))
for m in multi_matches:
    print(m)

print("\nErrors found (%i total):" % len(all_errors))
for de in all_errors:
    print(de)
