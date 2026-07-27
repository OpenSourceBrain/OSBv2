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

// Tolerance (in seconds) applied to the token expiry check to absorb clock
// skew between the browser and the auth server. Without it a freshly issued
// token can be judged "expired" the instant it is minted, so a re-login
// silently fails to take. 30s matches the usual JWT clock-tolerance default.
const TOKEN_EXPIRY_LEEWAY_SECONDS = 30;

// Where to send the user back after an auth round-trip.
const LOGIN_REDIRECT_KEY = "osb-login-redirect";


let usersApi: accountsApi.UsersApi = new accountsApi.UsersApi(
  new Configuration({ basePath: accountsApiUri })
);

declare const window: any;



export const initApis = () => {
  const token = getToken();
  // Set (or clear) the token used by the jupyterhub cloudharness authenticator.
  // Never write the literal string "null": that leaks a bogus token to the
  // authenticator and looks like a logged-in-but-broken session.
  if (token) {
    document.cookie = `accessToken=${token};path=/;domain=${getBaseDomain()}`;
  } else {
    clearAuthCookies();
  }
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
    isAdmin: userInfo.realm_access?.roles?.includes('administrator') || false,
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

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${getBaseDomain()}`;
}

function isLocalhost(): boolean {
  return window.location.hostname.includes("localhost");
}

// Clears the auth cookies so the gatekeeper starts a clean OAuth flow. Skipped
// on localhost where auth is proxied and cookies are managed externally.
function clearAuthCookies() {
  if (isLocalhost()) {
    return;
  }
  deleteCookie("kc-access");
  deleteCookie("accessToken");
}

// True when the decoded token is missing, has no expiry, or expired more than
// the leeway ago. The leeway keeps a just-issued token valid despite clock skew.
function isTokenExpired(decoded: any): boolean {
  if (!decoded || !decoded.exp) {
    return true;
  }
  // exp is in seconds, Date.now() is in milliseconds.
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp + TOKEN_EXPIRY_LEEWAY_SECONDS < currentTime;
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
  const token = getCookie("kc-access");

  if (!token) {
    return null;
  }

  let decoded: any = null;
  try {
    decoded = parseJwt(token);
  } catch {
    // Malformed token: treat as expired so the stale cookie gets cleared below.
    decoded = null;
  }

  if (isTokenExpired(decoded)) {
    clearAuthCookies();
    return null;
  }

  return token;
}

export function initUser(): UserInfo {
  const token = getToken();

  return mapKeycloakUser(parseJwt(token));
}

export async function login() {
  // Drop any stale/expired auth cookies first so the gatekeeper always begins
  // a fresh OAuth flow instead of trying to reuse an expired token — reusing a
  // stale token is what makes re-login after expiry unreliable.
  clearAuthCookies();

  // Remember where the user was so we can return them there after auth instead
  // of always dropping them on the home page.
  try {
    const returnTo = window.location.pathname + window.location.search;
    // Only same-origin absolute paths; guard against protocol-relative ("//")
    // to avoid an open-redirect, and don't loop back to /login.
    if (
      returnTo.startsWith("/") &&
      !returnTo.startsWith("//") &&
      returnTo !== "/login"
    ) {
      sessionStorage.setItem(LOGIN_REDIRECT_KEY, returnTo);
    }
  } catch {
    // sessionStorage may be unavailable (e.g. private mode); ignore.
  }

  window.location.href = "/login";
}

// Consumes the path stored before an auth redirect, defaulting to home. Safe to
// call once from the /login route to send the user back where they started.
export function popLoginRedirect(): string {
  try {
    const target = sessionStorage.getItem(LOGIN_REDIRECT_KEY);
    sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
    if (target && target.startsWith("/") && !target.startsWith("//")) {
      return target;
    }
  } catch {
    // ignore
  }
  return "/";
}

export async function logout() {
  // Drop the local auth cookies before hitting the gatekeeper so a stale
  // kc-access can't silently re-authenticate the previous user on the next
  // visit — this is what made re-login after a user switch unreliable.
  clearAuthCookies();
  try {
    await fetch("/oauth/logout");
  } catch {
    // ignore network errors and redirect anyway
  }
  window.location.href = "/";
}

export function canEditWorkspace(user: UserInfo, workspace: Workspace) {
  return Boolean(user && (user.isAdmin || workspace?.userId === user.id));
}

export function canEditRepository(user: UserInfo, repository: OSBRepository) {
  return user && (user.isAdmin || repository?.userId === user.id);
}
