ARG REGISTRY
ARG TAG=latest
FROM ${REGISTRY}jupyterhub:${TAG}

USER root

COPY src src
RUN pip install ./src/osb_jupyter
RUN chmod 777 /usr/local/lib/python3.6/dist-packages/  -R
USER jovyan
