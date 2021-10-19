FROM jupyter/base-notebook:hub-1.4.2
USER root

ENV NETPYNE_CORE_REPO=https://github.com/Neurosim-lab/netpyne
ENV NETPYNE_CORE_BRANCH_TAG=osbv2


RUN apt-get update
RUN apt-get install python-lxml -y
RUN apt-get install graphviz -y
RUN apt-get install openjdk-11-jdk -y

RUN apt-get install git vim htop -y      # git and general utilities
RUN apt-get install make cmake libncurses-dev g++ -y  # make etc. to allow NEURON's nrnivmodl

RUN pip install neuron

# Install specific version of NetPyNE
RUN git clone $NETPYNE_CORE_REPO -b $NETPYNE_CORE_BRANCH_TAG
RUN cd netpyne ; python setup.py install; cd -

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
