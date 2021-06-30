ARG CLOUDHARNESS_BASE
FROM $CLOUDHARNESS_BASE as base
RUN echo $CLOUDHARNESS_BASE

FROM jupyter/base-notebook:hub-1.1.0
USER root

RUN apt-get update
RUN apt-get install python-lxml -y
RUN apt-get install graphviz -y
RUN apt-get install openjdk-11-jdk -y

RUN apt-get install git vim htop -y      # git and general utilities
RUN apt-get install make cmake libncurses-dev g++ -y  # make etc. to allow NEURON's nrnivmodl

RUN pip install neuron
RUN pip install netpyne
RUN pip install pynwb
RUN pip install pyneuroml


COPY --from=base libraries/cloudharness-common/requirements.txt /libraries/cloudharness-common/requirements.txt
RUN pip install -r /libraries/cloudharness-common/requirements.txt
COPY --from=base libraries/client/cloudharness_cli/requirements.txt /libraries/client/cloudharness_cli/requirements.txt
RUN pip install -r /libraries/client/cloudharness_cli/requirements.txt

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


RUN chown jovyan /opt
RUN chown -R jovyan /opt/conda  # give user permission to update existing packages 


USER jovyan
# sym link workspace pvc to $FOLDER
RUN mkdir -p /opt/workspace
RUN mkdir -p /opt/home
RUN ln -s /opt/workspace workspace

RUN mkdir -p .jupyter/lab
RUN ln -s /opt/workspace .jupyter/lab/workspaces

COPY conf/ .jupyter/lab/user-settings/@jupyterlab

WORKDIR /opt/workspace
