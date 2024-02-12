
known_users = {'Padraig_v2':"0103eaaf-6a34-4509-a025-14367a52aa2b", 
               'Padraig_test_v2': '6bd142c3-05c1-4509-9cd6-5475af86bc46',
               'Filippo_v2': '1839ee9a-d481-4261-b7dc-b282c34e0ac6',
               'Ankur_v2': '3ad0ac48-617e-4b3e-ad5e-ace059cc0a07',
               'OSBAdmin_v2': '7aafb661-2f39-4683-8f35-528de0752dd7',

               'Padraig_v2dev': "7089f659-90ad-4ed9-9715-2327f7e2e72f",
               'Filippo_v2dev': 'a2514035-c47f-4d8a-b22b-081d91a5ce6b',
               'Simao_v2dev': 'ee8a31d7-d54d-413c-a4c9-e140cf77404f',
               'OSBAdmin_v2dev': '095e311e-336f-47d6-b4f6-16f6dd771a8d'}

def lookup_user(uid, url):
    if not uid in known_users.values():
        raise Exception('Unknown user: %s;%s'%(uid, url))
    for user in known_users:
        if uid == known_users[user]:
            return user
            

def get_tags_info(dandi_api_info=None, dandishowcase_info=None, osbv1_info=None, modeldb_info=None):
    
    tags = []

    if modeldb_info is not None:
        tags.append('ModelDB')
        tags.append('ModelDB:%s'%modeldb_info['id'])
        for category in ["model_concept", "currents","modeling_application"]:
            if category in modeldb_info:
                for v in modeldb_info[category]["value"]:
                    val = v["object_name"].strip()

                    val = val.replace('++','plusplus')
                    val = val.replace('Na+','Na')
                    tags.append(val)

    if osbv1_info is not None:
        tags.append('OSBv1')
        if 'Tags' in osbv1_info:  # osbv1...
            ts = osbv1_info['Tags'].split(',')
            for tag in ts:
                if len(tag)>0:
                    tag = tag.strip()
                    if tag.endswith(','):
                        tag = tag[:-1]
                    tags.append(tag)
        
        for field in ['Original format','Cell type','Brain region', 'Specie']:
            if field in osbv1_info:  
                val = osbv1_info[field]
                if not val in ['None','Other','']:
                    val = val.replace('PV+','PV')
                    val = val.replace('C++','Cplusplus')
                    if not val in tags:
                        tags.append(val)
    
    if dandi_api_info is not None:

        for tag in dandi_api_info.tags:
            if len(tag)>0:
                tag = tag.strip()
                if tag.endswith(','):
                    tag = tag[:-1]
                tags.append(tag)

    if dandishowcase_info is not None:
        tags.append('%s'%dandishowcase_info['identifier'])
        tags.append('DANDI')
        if dandishowcase_info['data_type']=='Neurodata Without Borders (NWB)':
            tags.append('NWB')
        if dandishowcase_info['data_type']=='Brain Imaging Data Structure (BIDS)':
            tags.append('BIDS')

        if dandishowcase_info['species']:
            tags.append('%s'%dandishowcase_info['species'])

    tags_list = []
    tags = sorted(tags)
    for tag in tags:
        tags_list.append({"tag": tag})

    print("    ------------ Tags: ---------")
    print("       %s"%tags)
    #print("       %s"%tags_list)

    return tags_list

def get_github():
    from github import Github

    # Authentication is defined via github.Auth
    from github import Auth
    
    # using an access token
    auth_token = str(open('github.auth','r').readline())
    auth = Auth.Token(auth_token)

    # First create a Github instance:

    # Public Web Github
    gh = Github(auth=auth)

    print("Authenticated using PyGitHub with user: %s"%gh.get_user().login)

    return gh

