#!/bin/sh

sed -i "s/__DOMAIN__/${DOMAIN}/g" /usr/share/nginx/html/keycloak.json

nginx -g "daemon off;"