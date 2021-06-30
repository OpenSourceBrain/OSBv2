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
