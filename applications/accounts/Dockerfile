FROM quay.io/keycloak/keycloak:26.2.5

EXPOSE 9000
EXPOSE 8080
USER root
COPY --chmod=0755 scripts/create_api_user.sh /opt/keycloak/startup-scripts/create_api_user.sh
COPY --chmod=0755 scripts/kc-entrypoint.sh /opt/keycloak/bin/kc-entrypoint.sh

USER keycloak

# Customize keycloak look
COPY themes/custom /opt/keycloak/themes/custom

# # keycloak kafka listener plugin
COPY plugins/* /opt/keycloak/providers/

ENTRYPOINT [ "/opt/keycloak/bin/kc-entrypoint.sh" ]
CMD [ "start-dev", "--import-realm", "--health-enabled=true", "--metrics-enabled=true" ]