# OSB admin (backoffice) app (www)
The OSB admin/backoffice app is for administrators to manage the OSB platform.

## Get started

## Prerequisites

Cloudharness must be installed.

## Development instructions

For developers it is very handy to run the app local instead of in the cluster.
Locally changes made are directly reflected in the app. Also debugging a local app is easier.

To start the local instance use 
```
sudo npm run start:dev
```

This will spin up the webpack dev server in https mode listening on port 443. Because port 443 lays in 
the "protected" area (port numbers <1024) of linux it is needed to run it as a SuperUser

Make sure the correct node version (for now 13) is installed in "/usr/local/bin"

When using nvm (node version manager, see [github](https://github.com/nvm-sh/nvm)) you can sym link:
```
nvm install 13
nvm use 13
sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/node" "/usr/local/bin/node"
sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/npm" "/usr/local/bin/npm"
```

The local webpack dev server uses [keycloak_dev.json](src/assets/keycloak_dev.json) for connecting to the keycloak accounts system.
Please check this file and change the domain according to your setup.

### Self Signed Certificates

When running on a local minikube please make sure you import the generated cacert certificates. The certificate file is most likely to be found here ./deployment/helm/resources/certs/cacert.crt

For Google Chrome: [manage certificates](chrome://settings/certificates?search=manage+certificate)

Select Authorities
and import the cacert

### Development

The application relies on other backend applications to be in place:
 - accounts.* for user management
 - workspaces.* for workspaces

The dependency on these applications can be handled differently with the following commands:
- `npm run start:dev`: No backend 
- `npm run start:test`: use test deployment applications (v2.opensourcebrain.org)
- `npm run start:minikube`: use local minikube deployment applications (osb.local)
- `USE_MOCKS=true npm run start:dev`: uses workspace mock responses

The webpack-dev-server will reroute the proxy /proxy/workspaces to the given backend instead of the workspace manager app.


#### Rest client generate

The workspaces application backend rest client is connected through automatically generated api.

Install generator:
```
npm install @openapitools/openapi-generator-cli -g
```

```
openapi-generator-cli generate -i ../workspaces/api/openapi.yaml -g typescript-fetch -o src/apiclient/workspaces
openapi-generator-cli generate -i ../accounts-api/api/openapi.yaml -g typescript-fetch -o src/apiclient/accounts
```

After the generation, may need to fix runtime.ts file:


replace `export type FetchAPI = GlobalFetch['fetch'];` with

```typescript
export type FetchAPI = WindowOrWorkerGlobalScope['fetch'];
```

# Trubleshooting

## 502 error on registration

The error is related to ingress nginx proxy size.
Edit the configmap nginx-load-balancer-conf (or nginx-ingress-controller) and set value:

```yaml
data:
  "proxy-buffer-size": "16k"
```



