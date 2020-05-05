#!/bin/sh

sed -i "s/__DOMAIN__/${CH_ACCOUNTS_AUTH_DOMAIN}/g" /usr/share/nginx/html/keycloak.json
sed -i "s/__NAMESPACE__/${CH_ACCOUNTS_REALM}/g" /usr/share/nginx/html/keycloak.json

nginx -g "daemon off;"