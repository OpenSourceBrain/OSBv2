'''
Script to get OSB repo info on GitHub
'''
import json 
import pprint

from utils import get_github

info = {}

verbose = True # 
verbose = False

gh = get_github()

for repo in gh.get_user().get_repos():
    if 'OpenSourceBrain' in repo.url:
        print('=============== %s ============'%repo.url)
        
        if verbose:
            pprint.pprint(repo.__dict__, compact=True)
        if not repo.private:
            info[repo.url]={}
            for k, v in repo.__dict__['_rawData'].items():
                info[repo.url][k]=v
        else:
            print("Ignoring, as it's private: %s"%repo.url)

filename = 'cached_info/osb_gh.json'  

strj = json.dumps(info, indent='    ', sort_keys=True)
with open(filename, "w") as fp:
    fp.write(strj)

print('Data on OSB GitHub org (%i repositories) written to %s'%(len(info),filename))