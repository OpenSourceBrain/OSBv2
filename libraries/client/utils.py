
known_users = {'Padraig_v2':"0103eaaf-6a34-4509-a025-14367a52aa2b", 
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
            

def get_dandi_tags_info(dandi_api_info, dandishowcase_entry):
    
    tags=[{"tag": tag} for tag in dandi_api_info.tags]

    tags.append({"tag": '%s'%dandishowcase_entry['identifier']})
    tags.append({"tag": 'DANDI'})
    if dandishowcase_entry['data_type']=='Neurodata Without Borders (NWB)':
        tags.append({"tag": 'NWB'})
    if dandishowcase_entry['data_type']=='Brain Imaging Data Structure (BIDS)':
        tags.append({"tag": 'BIDS'})

    if dandishowcase_entry['species']:
        tags.append({"tag": '%s'%dandishowcase_entry['species']})

    print("    ------------ Tags: ---------")
    print("       %s"%tags)

    return tags
