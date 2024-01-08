'''
Script to get OSBv1 project info
'''

import sys
import json

import osb
import operator
import pprint

from utils import get_github

verbose = True # 
verbose = False


info = {}
with_gitrepo = 0

fork_if_missing = '-fork' in sys.argv

gh = get_github()

known_to_have_other_forks = [2730, 3343, 3658]

if __name__ == "__main__":
    
    max_num = 5
    index = 0

    from osb.utils import get_page
    
    models_json = get_page('https://modeldb.science/api/v1/models')

    models = json.loads(models_json)
    pprint.pprint(models, compact=True)

    selection = models[:max_num]
    for model in selection:
        print("\n--------   Model (%i/%i): %s:\n" % (index, len(selection), model))

        info[model]= json.loads(get_page('https://modeldb.science/api/v1/models/%s'%model))

        print('    %s'%info[model]['name'])
        if 'gitrepo' in info[model] and info[model]['gitrepo']:
            with_gitrepo+=1
            print('    gitrepo: %s'%info[model]['gitrepo'])
        else:
            print('    gitrepo: %s'%False)

        expected_forks = 0
        possible_mdb_repo = 'ModelDBRepository/%s'%(info[model]['id'])
        mdb_repo = gh.get_repo(possible_mdb_repo)

        repo_to_use = mdb_repo
        print('    Exists at: %s (def branch: %s; forks: %i)'%(mdb_repo.html_url, mdb_repo.default_branch, mdb_repo.forks))

        possible_osbgh_repo = 'OpenSourceBrain/%s'%(info[model]['id'])
        try:
            osb_repo = gh.get_repo(possible_osbgh_repo)
            print('    Exists at: %s (def branch: %s; forks: %i)'%(osb_repo.html_url, osb_repo.default_branch, osb_repo.forks))
            repo_to_use = osb_repo
            expected_forks+=1
        except:
            print('    Missing fork: %s, forking now: %s'%(possible_osbgh_repo, fork_if_missing))
            if fork_if_missing:
                print('    Forking to: %s...'%possible_osbgh_repo)
                org = gh.get_organization('OpenSourceBrain')
                org.create_fork(mdb_repo,default_branch_only=False)
                print('    Forked!')

        if (not mdb_repo.forks==expected_forks) and (not (info[model]['id'] in known_to_have_other_forks)):
            print('Unexpected forks for %i (%s != %s)...'%(info[model]['id'], mdb_repo.forks,expected_forks))
    
            exit()

        info[model]['osbv2_gh_repo'] = repo_to_use.html_url
        info[model]['osbv2_gh_branch'] = repo_to_use.default_branch

        index +=1

    if verbose:
        infop = pprint.pprint(info, compact=True)

    print("\nThere were %i models, %i of which had gitrepo\n"%(len(info), with_gitrepo))

filename = 'cached_info/modeldb.json'  

strj = json.dumps(info, indent='    ', sort_keys=True)
with open(filename, "w") as fp:
    fp.write(strj)


print('Data on ModelDB (%i models) written to %s'%(len(info),filename))