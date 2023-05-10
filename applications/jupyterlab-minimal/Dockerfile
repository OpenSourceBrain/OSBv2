FROM jupyter/base-notebook:hub-1.4.2

COPY hub/jupyter_notebook_config.py /etc/jupyter/jupyter_notebook_config.py
USER root
RUN mkdir /opt/workspace
RUN chown -R jovyan:users /opt/workspace
COPY --chown=jovyan:users overrides/* /opt/conda/share/jupyter/lab/static/
USER jovyan
