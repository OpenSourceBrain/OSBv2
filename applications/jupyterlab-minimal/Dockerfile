FROM jupyter/base-notebook:hub-1.5.0

USER root
RUN mkdir /opt/workspace
RUN chown -R jovyan:users /opt/workspace
COPY --chown=jovyan:users overrides/* /opt/conda/share/jupyter/lab/static/
USER jovyan
