import { User } from "../types/model";
import { useKeycloak } from '@react-keycloak/ssr';
import type { KeycloakInstance } from 'keycloak-js'

export class UserService {

    keycloak: KeycloakInstance;

    constructor(keycloakInstance: KeycloakInstance) {
        this.keycloak = keycloakInstance;
    }

    getLoggedInUser(): User {
        return this.keycloak?.tokenParsed
    }

    login() {
        if (this.keycloak) {
            window.location.href = this.keycloak.createLoginUrl()
        }
    }

    logout() {
        if (this.keycloak) {
            window.location.href = this.keycloak.createLogoutUrl()
        }
    }

    register() {
        if (this.keycloak) {
            window.location.href = this.keycloak.createRegisterUrl()
        }
    }

}

/**
 * Hook to get the service
 */
export function useUserService() {
    const { keycloak } = useKeycloak<KeycloakInstance>();
    const userService = new UserService(keycloak);
    return userService;
}

