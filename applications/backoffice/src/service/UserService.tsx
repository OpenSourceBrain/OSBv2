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
  repositoryService.initApis(token);
  workspaceService.initApis(token);
  usersApi = new accountsApi.UsersApi(new Configuration({ basePath: accountsApiUri, accessToken: getToken() }));
}

export async function getUser(userid: string): Promise<User> {
  return usersApi.getUser({ userid });
}

export async function getUsers(): Promise<User[]> {
  return (await usersApi.getUsers({})).users;
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

export function getCurrentUser() {
  if (
    document.location.hostname === "localhost" &&
    document.location.pathname === "/login"
  ) {
    setCookie(
      "kc-access",
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI2ZU5kTUlHSWtha3duYjF2NDNMYWNNZ1k4emx3WDJ0X0dkZnAxdnNsYmVNIn0.eyJleHAiOjE2NjI5ODY1MzcsImlhdCI6MTY2Mjk4NjIzNywiYXV0aF90aW1lIjoxNjYyOTg2MDk3LCJqdGkiOiI0YTE0N2RiMi0zNWY3LTRiM2YtOWU5Mi0zZGNiMzEyODFlZjMiLCJpc3MiOiJodHRwOi8vYWNjb3VudHMuYXJlZy5sb2NhbC9hdXRoL3JlYWxtcy9hcmVnIiwiYXVkIjpbIndlYi1jbGllbnQiLCJhcmVnLXBvcnRhbCIsImFyZWdfcG9ydGFsIl0sInN1YiI6ImRjZWEzZjIxLWMwMmYtNDU2MS1iNzI3LTU2OGFhNjk5Njc5YSIsInR5cCI6IkJlYXJlciIsImF6cCI6IndlYi1jbGllbnQiLCJzZXNzaW9uX3N0YXRlIjoiNTllMGI0YWEtNDhlOC00YTIyLTg2MWMtMTU1NjQzMDgyMTdkIiwiYWNyIjoiMCIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJhZG1pbmlzdHJhdG9yIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYXJlZy1wb3J0YWwiOnsicm9sZXMiOlsiYWRtaW5pc3RyYXRvciIsImFyZWdfcG9ydGFsOmFkbWluaXN0cmF0b3IiXX0sImFyZWdfcG9ydGFsIjp7InJvbGVzIjpbImFkbWluaXN0cmF0b3IiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGFkbWluaXN0cmF0b3Itc2NvcGUgZW1haWwiLCJzaWQiOiI1OWUwYjRhYS00OGU4LTRhMjItODYxYy0xNTU2NDMwODIxN2QiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkB0ZXN0dXNlci5jb20ifQ.Es7VpTPssG_aqOa2g5LCgvAb6ihafYc109C4Ri92XQKI1fiOPQcUnK-uYzAK-5jfsKHhcd9yU1F4TUXbPHHBEJ-cc1a9toC8GzuYCM6wo9HvbYTa5kmUh782SnfGG60Kblg22mkg1I8Rf5SKdo-SA9YEqAKEwOkzF2w_0FEG5lW_w6DCyir7t6n3mzOHWaGIRBjjfAMgAZzDALD90CS8AK4447Gc7rpAoLjKIM5RRLwU188bXQaDqkETcMDndT2qviXTN5wZLlcRDePjJVMR5wVInKtv7_k_RO-8xZW2UTukpTOzHYxE1oeylCG9jmLvItqg1mWtoyuhyFQ6lPtnHA; kc-state=tNkG7Xz78f8LXXFmSs6iF4udrRkkOoT3B+JvFUgThizsXy7IJ13UllLu9eCRq+hx5BL8rmlXC4r64a1SudvRsWoMfQUOvE7HmFK6wpMelQcTwjnCjcvYw6V7K/bXDq7AmpLLq2QJMc56JYT08gll9uXLBoBEDKfyPyFoRUgxJXXxHnzAPHiBFruN1jKVuTh7Yqcg0m0GHrD+hmcRsARLofprIyYpQw3HcBjD5nBv1LSunAmTwWfnyejPDcKqGZMAwnqBJfPvQjIfYxCXKYGCOtrTd8mrQcfXJB1I8oTc8qXvv2qCQ/mjfwkwBPxo4a7UXnfoNzmaYWWOCenYoYoxj0HSoZ5kxlFxn+XIGFkZMLdjsZ2JRhQePREF5oPrQY9Mqo41f3KSSjkj9Tb6H6RRxg0sLHTXMFv6CD6M/OcSNgDeWZSunRRENZUzCIYmJ+tAzvz2jfT5fbMw2t0jR2DhldGF0MpEEbMEqg8y1F5Wo36431Rh9pUQ7cM+7frQeWCAsISRH+pT1BIKtoFZp9pBX9jBnSrs3EKCYJMIFsMqXx7U8CUXkelyJrW4fV+n3beRr7FOgrbNMxTAuOYF01HQxbnhQLWuLmfPIouF7SgMWDBm+yxpn6iMA4ZsSov/DsEntBUAuBAWRvQpXahWrbWY22WVUWRlNeSehsEgCo9eHJSnzfMGS1BRaXoZVIWyvSU+t2LfvuG9//J96RguWklLYEMajfSZdt5JYMy+YAKzao9pLVzTRwzFEuY0HRpFfe+5mIREPFEWcfgohdiZk8kmz62DV28xUk9UZhjF0DwsxbsMvBNAtHa/9lMSNNuMUddgd/2QybmErqFd8lxd+x1wuvPyHTbilQk1STpVx7PJTypL3T7QPHfzDS2RRsPpy4EwcnjXFRw1+uSh/WEJi+NQmcLp6sL9nulSZnPBX5qPf9SudoyqK5l0AVqVlkl0AM1rJ7bFgRaWVn0x",
      1
    );
  }
  return parseJwt(getToken());
}

export function getToken(): string {
  return getCookie("kc-access");
}


function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
}

function parseJwt(token: string): User {
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


function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

initApis(getToken());