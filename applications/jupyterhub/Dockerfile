FROM jupyter/base-notebook:hub-1.1.0
USER root

COPY src src
RUN pip install ./src/harness_jupyter
RUN pip install ./src/chauthenticator
RUN pip install ./src/osb_jupyter


COPY --chown=1000:1000 theming/page.html /opt/conda/share/jupyterhub/templates/page.html
COPY --chown=1000:1000 theming/spawn_pending.html /opt/conda/share/jupyterhub/templates/spawn_pending.html
COPY --chown=1000:1000 theming/hot_fix_for_eventsource.js /opt/conda/share/jupyterhub/static/hot_fix_for_eventsource.js

COPY hub/jupyter_notebook_config.py /etc/jupyter/jupyter_notebook_config.py

# Link jupyter lab workspace to osb workspace
RUN mkdir /opt/workspace
RUN chown jovyan /opt/workspace
USER jovyan
RUN mkdir -p .jupyter/lab
RUN ln -s /opt/workspace .jupyter/lab/workspaces


WORKDIR /opt/workspace