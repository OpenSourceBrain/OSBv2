ARG CLOUDHARNESS_BASE
FROM $CLOUDHARNESS_BASE as base
RUN echo $CLOUDHARNESS_BASE

FROM jupyterhub/k8s-hub:1.1.3
USER root

RUN apt update && apt install nano

COPY --from=base libraries/models/requirements.txt /libraries/models/requirements.txt
RUN pip install -r /libraries/models/requirements.txt
COPY --from=base libraries/cloudharness-common/requirements.txt /libraries/cloudharness-common/requirements.txt
RUN pip install -r /libraries/cloudharness-common/requirements.txt
COPY --from=base libraries/client/cloudharness_cli/requirements.txt /libraries/client/cloudharness_cli/requirements.txt
RUN pip install -r /libraries/client/cloudharness_cli/requirements.txt

COPY --from=base libraries/models /libraries/models
RUN pip install -e /libraries/models

COPY --from=base libraries/cloudharness-common /libraries/cloudharness-common
COPY --from=base libraries/client/cloudharness_cli /libraries/client/cloudharness_cli

#
RUN pip install -e /libraries/cloudharness-common
RUN pip install -e /libraries/client/cloudharness_cli

COPY src /usr/src/app

RUN pip install -e /usr/src/app/harness_jupyter
RUN pip install -e /usr/src/app/chauthenticator
RUN pip install -e /usr/src/app/osb_jupyter


COPY --chown=1000:1000 theming/page.html /usr/local/share/jupyterhub/templates/page.html
COPY --chown=1000:1000 theming/spawn_pending.html /usr/local/share/jupyterhub/templates/spawn_pending.html
COPY --chown=1000:1000 theming/hot_fix_for_eventsource.js /usr/local/share/jupyterhub/static/hot_fix_for_eventsource.js
COPY --chown=1000:1000 theming/arrow-dropdown.svg /usr/local/share/jupyterhub/static/arrow-dropdown.svg

RUN chmod 777 /usr/src/app -R
USER jovyan


