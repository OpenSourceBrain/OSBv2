"""
Script to get Biomodels project info
"""

import json
import pprint
from loadbiomodels import get_model_identifiers, get_model_info

verbose = True  #
verbose = False

info_all = {}


if __name__ == "__main__":
    min_index = 0
    max_index = 78000
    index = 0

    from loadbiomodels import get_model_identifiers

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

    print("\nThere were %i models checked\n" % (len(info)))

filename = "cached_info/biomodels.json"

strj = json.dumps(info_all, indent="    ", sort_keys=True)
with open(filename, "w") as fp:
    fp.write(strj)


print("Data on Biomodels (%i models) written to %s" % (len(info), filename))
