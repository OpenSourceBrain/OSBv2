"""
Script to get Biomodels project info
"""

import sys
import json

import osb
import operator
import pprint

verbose = True  #
verbose = False

info_all = {}

from loadbiomodels import get_model_identifiers, get_model_info


if __name__ == "__main__":
    min_index = 0
    max_index = 20
    index = 0

    from loadbiomodels import get_model_identifiers

    model_ids = get_model_identifiers()["models"]

    selection = model_ids[min_index:max_index]

    for model_id in selection:
        print(
            "\n--------   Model (%i/%i, order %i): %s:\n"
            % (index, len(selection), index + min_index, model_id)
        )

        model_link = f"[{model_id}](https://www.ebi.ac.uk/biomodels/{model_id})"
        info = get_model_info(model_id)
        model_name = info["name"]
        print(f"  {model_id}: \n    {pprint.pformat(info['name'])}--")

        info_all[model_id] = info
        """
        son.loads(get_page('https://modeldb.science/api/v1/models/%s'%model))

        print('    %s'%info[model]['name'])
        if 'gitrepo' in info[model] and info[model]['gitrepo']:
            with_gitrepo+=1
            print('    gitrepo: %s'%info[model]['gitrepo'])
        else:
            print('    gitrepo: %s'%False)

        expected_forks = 0
        possible_mdb_repo = 'ModelDBRepository/%s'%(info[model]['id'])
        try:
            mdb_repo = gh.get_repo(possible_mdb_repo)

            repo_to_use = mdb_repo
            print('    Exists at: %s (def branch: %s; forks: %i)'%(mdb_repo.html_url, mdb_repo.default_branch, mdb_repo.forks))

            possible_osbgh_repo = 'OpenSourceBrain/%s'%(info[model]['id'])
            try:
                osb_repo = gh.get_repo(possible_osbgh_repo)
                msg = '    Exists at: %s (def branch: %s; forks: %i), order %i'%(osb_repo.html_url, osb_repo.default_branch, osb_repo.forks, index+min_index)
                on_osbv2.append(msg)
                print(msg)
                repo_to_use = osb_repo
                expected_forks+=1

                info[model]['osbv2_gh_repo'] = repo_to_use.html_url
                info[model]['osbv2_gh_branch'] = repo_to_use.default_branch
            except:
                print('    Missing fork: %s, forking now: %s'%(possible_osbgh_repo, fork_if_missing))
                if fork_if_missing:
                    print('    Forking to: %s...'%possible_osbgh_repo)
                    org = gh.get_organization('OpenSourceBrain')
                    org.create_fork(mdb_repo,default_branch_only=False)
                    msg = '    Forked to: %s...'%possible_osbgh_repo
                    print(msg)
                    forked_now.append(msg)

                else:
                    msg = '    Yet to be forked: %i, order %i; %s'%(info[model]['id'], index+min_index,info[model]['name'])
                    print(msg)
                    to_be_forked.append(msg)


            if (not mdb_repo.forks==expected_forks) and (not (info[model]['id'] in known_to_have_other_forks)):
                msg = '    Unexpected forks for %i (%s != %s)...'%(info[model]['id'], mdb_repo.forks,expected_forks)
                print(msg)
                many_forks.append(msg)

        except:
            msg = '    Problem locating repo for: %i (%i/%i) %s'%(info[model]['id'],index, len(selection), info[model]['name'])
            print(msg)
            errors.append(msg)"""

        index += 1

    if verbose:
        infop = pprint.pprint(info_all, compact=True)

    print("\nThere were %i models checked\n" % (len(info)))

filename = "cached_info/biomodels.json"

strj = json.dumps(info_all, indent="    ", sort_keys=True)
with open(filename, "w") as fp:
    fp.write(strj)


print("Data on Biomodels (%i models) written to %s" % (len(info), filename))
