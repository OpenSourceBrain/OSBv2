import workspaceService from "./WorkspaceService";
import repositoryService from "./RepositoryService";
import groupsService from "./GroupsService"
import { UserInfo } from "../types/user";
import { Workspace } from "../types/workspace";
import { OSBRepository } from "../apiclient/workspaces";
import { Configuration, User } from "../apiclient/accounts";
import * as accountsApi from "../apiclient/accounts/apis";
import { getBaseDomain } from "@/utils";


const accountsApiUri = "/proxy/accounts-api/api";


let usersApi: accountsApi.UsersApi = new accountsApi.UsersApi(
  new Configuration({ basePath: accountsApiUri })
);

declare const window: any;



export const initApis = () => {
  const token = getToken();
  // Set token used by jupyterhub cloudharness authenticator
  document.cookie = `accessToken=${token};path=/;domain=${getBaseDomain()}`;
  repositoryService.initApis(token);
  workspaceService.initApis(token);
  groupsService.initApis(token);
  usersApi = new accountsApi.UsersApi(
    new Configuration({ basePath: accountsApiUri, accessToken: token })
  );

};

function mapKeycloakUser(userInfo: any): UserInfo {
  return userInfo && {
    id: userInfo.sub,
    firstName: userInfo.given_name,
    lastName: userInfo.family_name,
    email: userInfo.email,
    isAdmin: userInfo.realm_access.roles?.includes('administrator') || false,
    username: userInfo.preferred_username || userInfo.given_name,
  };
}



export async function getUser(userid: string): Promise<User> {
  // Note that the keycloak username is expected
  return usersApi.getUser({ userid });
}

export async function updateUser(user: User): Promise<User> {
  return usersApi.updateUser({ userid: user.id, requestBody: user });
}

function getCookie(name): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
}

function parseJwt(token: string) {
  if (!token) {
    return null;
  }
  const base64Url: string = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export function getToken(): string {
  return getCookie("kc-access");
}

export function initUser(): UserInfo {
  const token = getToken();

  return mapKeycloakUser(parseJwt(token));
}

export async function login() {
  window.location.href = "/login";
}

export async function logout() {
  return fetch("/oauth/logout").then(() => window.location.href = "/");
}

export function canEditWorkspace(user: UserInfo, workspace: Workspace) {
  return Boolean(user && (user.isAdmin || workspace?.userId === user.id));
}

export function canEditRepository(user: UserInfo, repository: OSBRepository) {
  return user && (user.isAdmin || repository?.userId === user.id);
}
