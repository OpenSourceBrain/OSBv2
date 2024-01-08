'''
Script to get OSBv1 project info
'''

import sys
import json

# https://github.com/OpenSourceBrain/OSB_API
import osb
import operator
import pprint
from utils import get_github

gh = get_github()

projects = 0
with_tags = 0
tags = {}

min_curation_level="Low"

info = {}

custom_fields = ["Original format","NeuroML version","ModelDB reference","Category",
                 "GitHub repository","NeuroML v1.x support","NEURON support",
                 "GENESIS 2 support","MOOSE support","NeuroML v2.x support",
                 "Status info","Spine classification","Family","Specie","Brain region",
                 "Cell type","Bitbucket repository","PSICS support","NEST support",
                 "PyNN support","Brian support","NeuroLex Ids: Cells","Curation level",
                 "Endorsement","CNO Ids","Metadata","Tags"]

if __name__ == "__main__":
    
    project_num = 1000
    if len(sys.argv) >= 2:
        project_num = int(sys.argv[1])

    for project in osb.get_projects(min_curation_level, limit=project_num):

        if project.is_standard_project() or project.is_showcase():

            info[project.identifier] = {}

            print("\n--------   Project: %s: %s\n" % (project.identifier,project.name))
            print(project)
            projects+=1
            info[project.identifier]['id'] = project.id
            info[project.identifier]['name'] = project.name
            info[project.identifier]['identifier'] = project.identifier
            info[project.identifier]['description'] = project.description


            for cf in custom_fields:
                cfv = project.get_custom_field(cf)
                if cfv is not None and len(cfv)>0:
                    info[project.identifier][cf] = cfv


            if project.tags:
                print("    Project has tags: %s" % (project.tags))
                with_tags +=1
                for tag in project.tags:
                    if not tag in tags:
                        tags[tag] = 0
                    tags[tag] +=1

            if 'GitHub repository' in info[project.identifier]:
                gh_repo_url = info[project.identifier]['GitHub repository']
                gh_repo_name = '%s/%s'%(gh_repo_url.split('/')[3],gh_repo_url.split('/')[4].replace('.git',''))
                #print(gh_repo_url)
                #print(gh_repo_name)
                gh_repo = gh.get_repo(gh_repo_name)
                info[project.identifier]['main_branch'] = gh_repo.default_branch

                print("    GH repo: %s\t(def branch: %s)"%(gh_repo_url, gh_repo.default_branch))


    print("\nThere were %i projects (min_curation_level=%s), %i of which had tags\n"%(projects, min_curation_level, with_tags))
    sorted_tags = sorted(tags.items(), key=operator.itemgetter(1), reverse=True)
    for s in sorted_tags:
        print("%s: %s %i projects"%(s[0], " "*(50-len(s[0])), s[1]))

    infop = pprint.pprint(info, compact=True)


filename = 'cached_info/projects_v1.json'  

strj = json.dumps(info, indent='    ', sort_keys=True)
with open(filename, "w") as fp:
    fp.write(strj)

'''
pretty_json_str = pprint.pformat(info, compact=False).replace("'",'"')

with open(filename, 'w') as f:
    f.write(pretty_json_str)'''

print('Data on OSBv1 (%i projects) written to %s'%(len(info),filename))