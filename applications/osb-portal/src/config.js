
export const CONFIGURATION = {
    "appName": "osb-portal"
};


export const keycloakCfg = {
    realm: process.env.NAMESPACE || 'osb2',
    url: `https://accounts.${process.env.DOMAIN || 'v2.opensourcebrain.org'}/auth/`,
    clientId: 'web-client'
  }