# OSB portal app (www)
The OSB portal app is the entrypoint of the OSBv2 platform. It serves the portal website.

## Get started

## Prerequisites

Cloudharness must be installed.

## Development instructions

For developers it is very handy to run the app local instead of in the cluster.
Locally changes made are directly reflected in the app. Also debugging a local app is easier.

To start the local instance use 
```
npm run start:dev
```

This starts the Vite dev server on `http://localhost:3000` (`server.host: '0.0.0.0'`,
`server.port: 3000` in `vite.config.ts`). No `sudo` is needed: Vite binds no protected port.

The container build uses Node 20 (`Dockerfile:1` `FROM node:20-slim`); use a current Node LTS locally.

When using nvm (node version manager, see [github](https://github.com/nvm-sh/nvm)) you can install and select the toolchain with:
```
nvm install 20
nvm use 20
```

The local Vite dev server uses [keycloak_dev.json](src/assets/keycloak_dev.json) for connecting to the keycloak accounts system.
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
- `npm run start:dev`: use the v2dev deployment applications (DOMAIN=https://v2dev.opensourcebrain.org, NAMESPACE=osb2dev)
- `npm run start:prod`: use the production deployment applications (v2.opensourcebrain.org / osb2)
- `npm run start:local`: use the local minikube deployment applications (osb.local / osblocal)
- `npm run start:dev-be` / `npm run start:local-be`: point the proxy at a single local backend through `WORKSPACES_DOMAIN` / `ACCOUNTS_API_DOMAIN`
- `npm run start:dev-app` / `npm run start:local-app`: serve the app locally against a deployed domain (`APP_DOMAIN`)
- `USE_MOCKS=true npm run start:dev`: uses workspace mock responses

The Vite dev server proxies `/proxy/workspaces` and `/proxy/accounts-api` to the host derived
from `DOMAIN` (or `WORKSPACES_DOMAIN` / `ACCOUNTS_API_DOMAIN` when set) instead of the workspace
manager app -- `server.proxy` in `vite.config.ts:28-41`.

## Production build

`npm run build` runs `vite build` (`package.json:17`) and writes the bundle to `public/`
(`build.outDir` in `vite.config.ts:43-45`). The image copies that directory to nginx's document
root (`Dockerfile:13`) and nginx listens on port 80 (`nginx.conf:41`); `deploy/values.yaml` sets
`harness.deployment.port: 80` and `harness.service.port: 80`. Production uses the same `vite build`
as local builds; no legacy bundler path exists. The only build-time difference is
Sentry: `vite.config.ts:13` bakes the literal `__SENTRY_DSN__` placeholder, `entrypoint.sh:9`
substitutes the `SENTRY_DSN` env var at container start, and only the prod deployment sets it
(`deploy/values-prod.yaml`); every other environment leaves it empty (`sentry: false` in
`deploy/values-local.yaml`, `values-minimal.yaml` and `values-netpyne.yaml`). `nginx.conf` contains
no `proxy_pass`, so the `/proxy/*` routing seen in a deployment is not configured in this
repository.


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



