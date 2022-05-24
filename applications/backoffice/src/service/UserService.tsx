import Keycloak from 'keycloak-js';

import workspaceService from './WorkspaceService';
import repositoryService from './RepositoryService';

import { UserInfo } from '../types/user';
import { getBaseDomain } from '../utils';
import { Workspace } from '../types/workspace';
import { OSBRepository } from "../apiclient/workspaces";
import { Configuration, User } from "../apiclient/accounts";
import * as accountsApi from '../apiclient/accounts/apis';



const accountsApiUri = '/proxy/accounts-api/api';

let usersApi: accountsApi.UsersApi = new accountsApi.UsersApi(new Configuration({ basePath: accountsApiUri })); ;

declare const window: any;

export const initApis = (token: string) => {
  document.cookie = `accessToken=${token};path=/;domain=${getBaseDomain()}`;
  repositoryService.initApis(token);
  workspaceService.initApis(token);
  usersApi = new accountsApi.UsersApi(new Configuration({ basePath: accountsApiUri, accessToken: token }));
}

export async function getUser(userid: string): Promise<User> {
  return usersApi.getUser({ userid });
}


export async function updateUser(user: User): Promise<User> {
  return usersApi.updateUser({ userid: user.id, requestBody: user });
}


export function canEditWorkspace(user: UserInfo, workspace: Workspace) {
  return Boolean(user && (user.isAdmin || workspace?.userId === user.id))
}

export function canEditRepository(user: UserInfo, repository: OSBRepository) {
  return user && (user.isAdmin || repository?.userId === user.id);
}
