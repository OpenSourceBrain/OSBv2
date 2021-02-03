import { FeaturedType } from './global'
import type { KeycloakInstance, KeycloakTokenParsed } from 'keycloak-js';

// Model object
export interface Model {
  id: number;
  name: string;
  description: string;
  image: string;
  type: FeaturedType;
}

export type User = KeycloakTokenParsed & {
  email?: string
  id?: string
  preferred_username?: string

  given_name?: string

  family_name?: string
}


