#!/bin/sh
sed -i "s/__DOMAIN__/${CH_ACCOUNTS_AUTH_DOMAIN:-https://accounts.osb.local/}/g" /usr/share/nginx/html/keycloak/keycloak.json
sed -i "s/__NAMESPACE__/${CH_ACCOUNTS_REALM:-osb2}/g" /usr/share/nginx/html/keycloak/keycloak.json
sed -i "s/__REALM__/${CH_ACCOUNTS_REALM:-osb2}/g" /etc/nginx/nginx.conf

# The built bundle is shared across every deployment; only the prod pod gets
# SENTRY_DSN (see deploy/values-prod.yaml), so this is the switch that keeps
# Sentry off everywhere else.
find /usr/share/nginx/html -name '*.js' -exec sed -i "s|__SENTRY_DSN__|${SENTRY_DSN:-}|g" {} +

nginx -g "daemon off;"