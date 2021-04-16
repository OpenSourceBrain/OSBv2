import Keycloak from 'keycloak-js';

import workspaceService from './WorkspaceService';

import { UserInfo } from '../types/user';
import { getBaseDomain } from '../utils';
import { Workspace } from '../types/workspace';

const keycloak = Keycloak('/keycloak.json');




declare const window: any;

export const initApis = (token: string) => {
    document.cookie = `accessToken=${token};path=/;domain=${getBaseDomain()}`;

    workspaceService.initApis(token);
}

function mapKeycloakUser(userInfo: any): UserInfo {
    return {
        id: userInfo.sub,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        email: userInfo.email,
        isAdmin: isUserAdmin()
    }
}

export function isUserAdmin(): boolean {
    return keycloak.hasRealmRole('administrator');
}

export async function initUser(): Promise<UserInfo> {
    let user = null;

    try {
        let authorized;
        await keycloak.init({
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
        }).then(authenticated => authorized = authenticated).catch(() => console.error("Cannot connect to user authenticator."));

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
            console.error('not refreshed ' + new Date());
        }
    }
    // set token refresh before 5 minutes
    keycloak.onTokenExpired = () => {
        keycloak.updateToken(60).then(tokenUpdated).catch(() => {
            console.error('Failed to refresh token ' + new Date());
        })
    }
    if (user) {
        keycloak.updateToken(-1).then(tokenUpdated).catch(() => {
            console.error('Failed to refresh token ' + new Date());
        });  // activate refresh token
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
}

export function canEditWorkspace(user: UserInfo, workspace: Workspace) {
    return user && (user.isAdmin || workspace.userId === user.id)
}
