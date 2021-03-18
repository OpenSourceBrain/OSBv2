ARG REGISTRY
ARG TAG=latest
ARG CLOUDHARNESS_BASE=${REGISTRY}cloudharness-base:${TAG}
FROM $CLOUDHARNESS_BASE as base
RUN echo $CLOUDHARNESS_BASE

FROM jupyter/base-notebook:hub-1.1.0
USER root

#COPY --from=base libraries/cloudharness-common/requirements.txt /libraries/cloudharness-common/requirements.txt
#RUN pip install -r /libraries/cloudharness-common/requirements.txt
#COPY --from=base libraries/client/cloudharness_cli/requirements.txt /libraries/client/cloudharness_cli/requirements.txt
#RUN pip install -r /libraries/client/cloudharness_cli/requirements.txt

COPY --from=base /libraries/cloudharness-common /libraries/cloudharness-common
COPY --from=base /libraries/client/cloudharness_cli /libraries/client/cloudharness_cli

RUN pip install -e /libraries/cloudharness-common
RUN pip install -e /libraries/client/cloudharness_cli

COPY src /usr/src/app

RUN pip install -e /usr/src/app/harness_jupyter
RUN pip install -e /usr/src/app/chauthenticator
RUN pip install -e /usr/src/app/osb_jupyter


COPY --chown=1000:1000 theming/page.html /opt/conda/share/jupyterhub/templates/page.html
COPY --chown=1000:1000 theming/spawn_pending.html /opt/conda/share/jupyterhub/templates/spawn_pending.html
COPY --chown=1000:1000 theming/hot_fix_for_eventsource.js /opt/conda/share/jupyterhub/static/hot_fix_for_eventsource.js

COPY hub/jupyter_notebook_config.py /etc/jupyter/jupyter_notebook_config.py

# Link jupyter lab workspace to osb workspace
RUN mkdir /opt/workspace
RUN chown jovyan /opt/workspace

RUN mkdir -p .jupyter/lab
RUN ln -s /opt/workspace .jupyter/lab/workspaces

COPY conf/ .jupyter/lab/user-settings/@jupyterlab
RUN chmod 777 .jupyter -R
WORKDIR /opt/workspace