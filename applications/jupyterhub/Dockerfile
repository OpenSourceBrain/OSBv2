FROM jupyterhub/k8s-hub:0.9.0
USER root

COPY src src
RUN pip install ./src/harness_jupyter
RUN pip install ./src/chauthenticator
RUN pip install ./src/osb_jupyter
RUN chmod 777 /usr/local/lib/python3.6/dist-packages/  -R
USER jovyan
