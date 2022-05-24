#!/bin/sh
sed -i "s/__DOMAIN__/${CH_ACCOUNTS_AUTH_DOMAIN:-https://accounts.osb.local/auth/}/g" /usr/share/nginx/html/keycloak/keycloak.json
sed -i "s/__NAMESPACE__/${CH_ACCOUNTS_REALM:-osb2}/g" /usr/share/nginx/html/keycloak/keycloak.json
sed -i "s/__REALM__/${CH_ACCOUNTS_REALM:-osb2}/g" /etc/nginx/nginx.conf


nginx -g "daemon off;"