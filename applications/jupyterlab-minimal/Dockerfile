FROM quay.io/jupyter/base-notebook:hub-4.0.2

USER root
RUN apt-get update && apt-get install git -y
RUN mkdir /opt/workspace
RUN chown -R jovyan:users /opt/workspace

COPY --chown=jovyan:users overrides/* /opt/conda/share/jupyter/lab/static/
USER jovyan
