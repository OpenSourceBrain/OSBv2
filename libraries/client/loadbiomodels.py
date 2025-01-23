
import requests

import pprint
import sys

API_URL: str = "https://www.ebi.ac.uk/biomodels"
out_format="json"

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

def get_model_identifiers():
    response = requests.get(API_URL + "/model/identifiers?format=" + out_format)
    response.raise_for_status()
    output = response.json()
    return output

def get_model_info(model_id):
    response = requests.get(API_URL + "/"+model_id+"?format=" + out_format)
    response.raise_for_status()
    output = response.json()
    return output

def main():

    model_ids = get_model_identifiers()['models'] 
    max_count = 10
    count = 0

    for model_id in model_ids:
        if count<max_count:
            if 'BIOMD' in model_id:
                model_link = f'[{model_id}](https://www.ebi.ac.uk/biomodels/{model_id})'
                info = get_model_info(model_id)
                model_name = info['name']
                print("\n===============================================")
                print(f"  {model_id}: \n{pprint.pprint(info['name'])}--")
                count+=1



if __name__ == "__main__":
    main()