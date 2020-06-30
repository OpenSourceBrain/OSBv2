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

### Using mock responses

To run the app with mock responses instead of real data set the environment variable USE_MOCKS to true.

```
sudo USE_MOCKS=true npm run start:dev
```

This will reroute the proxy /api/workspaces to https://www.osb.local/api-mocks instead of the workspace manager app.
If you run the dev server on another domain then please change the mock url (located in the webpack.dev.js)
