import Keycloak from 'keycloak-js';
import { userLogin } from '../store/actions/user';
import store from '../store/store';
import workspaceService from './WorkspaceService';
export const keycloak = Keycloak('keycloak.json');


export const initApis = (token: string) => {
    workspaceService.initApis(token);
}

export async function initUser() {

    keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    }).then(async (authorized: boolean) => {
        if (authorized) {
            const userInfo: any = await keycloak.loadUserInfo();
            store.dispatch(userLogin({
                id: userInfo.sub,
                firstName: userInfo.given_name,
                lastName: userInfo.family_name,
                emailAddress: userInfo.email
            })
            );
        }
        initApis(keycloak.token);
    }, errorCallback);

    // set token refresh to 5 minutes
    keycloak.onTokenExpired = () => {
        keycloak.updateToken(5).success((refreshed) => {
            if (refreshed) {
                initApis(keycloak.token);
            } else {
                console.error('not refreshed ' + new Date());
            }
        }).error(() => {
            console.error('Failed to refresh token ' + new Date());
        })
    }

}


const errorCallback = (error: any) => {
    initApis(null);
}
