FROM quay.io/keycloak/keycloak:16.1.0

# add kubectl
USER root
COPY --chmod=0755 scripts/create_api_user.sh /opt/jboss/startup-scripts/create_api_user.sh
USER jboss

# Customize keycloak look
COPY themes/custom /opt/jboss/keycloak/themes/custom

# keycloak kafka listener plugin
COPY plugins/metacell-admin-event-listener-bundle-1.0.0.ear /opt/jboss/keycloak/standalone/deployments/
