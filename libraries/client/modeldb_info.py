'''
Script to get OSBv1 project info
'''

import sys
import json

import osb
import operator
import pprint


info = {}
with_gitrepo = 0

if __name__ == "__main__":
    
    max_num = 10000
    index = 0

    if len(sys.argv) >= 2:
        max_num = int(sys.argv[1])

    from osb.utils import get_page
    
    models_json = get_page('https://modeldb.science/api/v1/models')

    models = json.loads(models_json)
    pprint.pprint(models, compact=True)

    selection = models[:max_num]
    for model in selection:
        print("\n--------   Model (%i/%i): %s:\n" % (index, len(selection), model))

        info[model]= json.loads(get_page('https://modeldb.science/api/v1/models/%s'%model))

        if 'gitrepo' in info[model] and info[model]['gitrepo']:
            with_gitrepo+=1
           
        index +=1
    infop = pprint.pprint(info, compact=True)

    print("\nThere were %i models, %i of which had gitrepo\n"%(len(info), with_gitrepo))


filename = 'cached_info/modeldb.json'  

strj = json.dumps(info, indent='    ', sort_keys=True)
with open(filename, "w") as fp:
    fp.write(strj)


print('Data on ModelDB (%i models) written to %s'%(len(info),filename))