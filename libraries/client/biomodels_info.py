"""
Script to get BioModels project info
"""

import requests
import json
import pprint

verbose = True  #
verbose = False

info_all = {}

API_URL: str = "https://www.ebi.ac.uk/biomodels"
out_format = "json"


def get_model_identifiers():
    response = requests.get(API_URL + "/model/identifiers?format=" + out_format)
    response.raise_for_status()
    output = response.json()
    return output


def get_model_info(model_id):
    response = requests.get(API_URL + "/" + model_id + "?format=" + out_format)
    response.raise_for_status()
    output = response.json()
    return output


if __name__ == "__main__":
    min_index = 0
    max_index = 10
    index = 1

    model_ids = get_model_identifiers()["models"]

    selection = model_ids[min_index:max_index]

    for model_id in selection:
        print(
            "\n--------   Model (%i/%i, order %i): %s:\n"
            % (index, len(selection), index + min_index, model_id)
        )

        model_url = f"https://www.ebi.ac.uk/biomodels/{model_id}"
        model_link = f"[{model_id}]({model_url})"
        try:
            info = get_model_info(model_id)
            model_name = info["name"]
            print(f"  {model_id}: \n    {pprint.pformat(info['name'])}--")

            info_all[model_id] = info
        except Exception as e:
            msg = f"Error retrieving model at {model_url}: {e}"

            print("  ******* %s" % msg)

            info_all[model_id] = {"error": msg}

        index += 1

    if verbose:
        infop = pprint.pprint(info_all, compact=True)

    print("\nThere were %i models checked\n" % (len(info_all)))

filename = "cached_info/biomodels.json"

strj = json.dumps(info_all, indent="    ", sort_keys=True)
with open(filename, "w") as fp:
    fp.write(strj)


print("Data on Biomodels (%i models) written to %s" % (len(info_all), filename))
