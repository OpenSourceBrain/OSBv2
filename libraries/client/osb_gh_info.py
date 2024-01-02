'''
Script to get OSB repo info on GitHub
'''
import json 
import pprint
from github import Github

# Authentication is defined via github.Auth
from github import Auth

# using an access token
auth_token = str(open('github.auth','r').readline())
auth = Auth.Token(auth_token)

# First create a Github instance:

# Public Web Github
g = Github(auth=auth)

info = {}

verbose = True # 
verbose = False

for repo in g.get_user().get_repos():
    if 'OpenSourceBrain' in repo.url:
        print('=============== %s ============'%repo.url)
        
        if verbose:
            pprint.pprint(repo.__dict__, compact=True)
        info[repo.url]={}
        for k, v in repo.__dict__['_rawData'].items():
            info[repo.url][k]=v

filename = 'cached_info/osb_gh.json'  

strj = json.dumps(info, indent='    ', sort_keys=True)
with open(filename, "w") as fp:
    fp.write(strj)

print('Data on OSB GitHub org (%i repositories) written to %s'%(len(info),filename))