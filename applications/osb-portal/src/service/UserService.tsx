import Keycloak from "keycloak-js";

import workspaceService from "./WorkspaceService";
import repositoryService from "./RepositoryService";
import groupsService from "./GroupsService"
import { UserInfo } from "../types/user";
import { getBaseDomain } from "../utils";
import { Workspace } from "../types/workspace";
import { OSBRepository } from "../apiclient/workspaces";
import { Configuration, User } from "../apiclient/accounts";
import * as accountsApi from "../apiclient/accounts/apis";

const keycloak = Keycloak("/keycloak.json");

const accountsApiUri = "/proxy/accounts-api/api";

let usersApi: accountsApi.UsersApi = new accountsApi.UsersApi(
  new Configuration({ basePath: accountsApiUri })
);

declare const window: any;

export const initApis = (token: string) => {
  if(token) {
    document.cookie = `accessToken=${token};path=/;domain=${getBaseDomain()}`;
    repositoryService.initApis(token);
    workspaceService.initApis(token);
    groupsService.initApis(token);
    usersApi = new accountsApi.UsersApi(
      new Configuration({ basePath: accountsApiUri, accessToken: token })
    );
  }

};

function mapKeycloakUser(userInfo: any): UserInfo {
  return userInfo && {
    id: userInfo.sub,
    firstName: userInfo.given_name,
    lastName: userInfo.family_name,
    email: userInfo.email,
    isAdmin: isUserAdmin(),
    username: userInfo.preferred_username || userInfo.given_name,
  };
}

export function isUserAdmin(): boolean {
  return keycloak.hasRealmRole("administrator");
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
  return getCookie("accessToken");
}

export function initUser(): UserInfo {
  const kcUser = parseJwt(getToken());
  return mapKeycloakUser(kcUser);
}

export async function checkUser(): Promise<UserInfo> {
  let user = null;

  try {
    let authorized;
    await keycloak
      .init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html",
      })
      .then((authenticated) => (authorized = authenticated))
      .catch(() => console.error("Cannot connect to user authenticator."));

    if (authorized) {
      const userInfo: any = await keycloak.loadUserInfo();
      user = mapKeycloakUser(userInfo);
    }
    initApis(keycloak.token);
  } catch (err) {
    errorCallback(err);
    return null;
  }

  const tokenUpdated = (refreshed: any) => {
    if (refreshed) {
      initApis(keycloak.token);
    } else {
      console.error("not refreshed " + new Date());
    }
  };
  // set token refresh before 5 minutes
  keycloak.onTokenExpired = () => {
    keycloak
      .updateToken(60)
      .then(tokenUpdated)
      .catch(() => {
        console.error("Failed to refresh token " + new Date());
      });
  };
  if (user) {
    keycloak
      .updateToken(-1)
      .then(tokenUpdated)
      .catch(() => {
        console.error("Failed to refresh token " + new Date());
      }); // activate refresh token
  }

  return user;
}

export async function login(): Promise<UserInfo> {
  const userInfo: any = await keycloak.login();
  return mapKeycloakUser(userInfo);
}

export async function logout() {
  return keycloak.logout();
}

export async function register() {
  return keycloak.register();
}

const errorCallback = (error: any) => {
  initApis(null);
};

export function canEditWorkspace(user: UserInfo, workspace: Workspace) {
  return Boolean(user && (user.isAdmin || workspace?.userId === user.id));
}

export function canEditRepository(user: UserInfo, repository: OSBRepository) {
  return user && (user.isAdmin || repository?.userId === user.id);
}
