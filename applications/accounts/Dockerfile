FROM quay.io/keycloak/keycloak:11.0.3

# add kubectl
USER root
COPY --chmod=0755 scripts/create_api_user.sh /opt/jboss/startup-scripts/create_api_user.sh
USER jboss

# Customize keycloak look
COPY themes/custom /opt/jboss/keycloak/themes/custom