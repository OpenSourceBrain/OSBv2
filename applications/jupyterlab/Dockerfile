FROM jupyter/base-notebook:hub-1.5.0
USER root


RUN apt-get update

####  General packages via apt-get

RUN apt-get install graphviz -y
RUN apt-get install openjdk-11-jre-headless -y

RUN apt-get install git vim htop ncdu -y      # git and general utilities
RUN apt-get install make cmake libncurses-dev g++ -y  # make etc. to allow NEURON`s nrnivmodl

################################################################################

####  NeuroML etc.
ENV NEURON_HOME=/opt/conda
ENV NETPYNE_CORE_REPO=https://github.com/Neurosim-lab/netpyne
ENV NETPYNE_CORE_BRANCH_TAG=osbv2

#### Install needed linux packages

USER root
# LFPy
RUN apt-get install libopenmpi-dev -y

####  Octave etc.
RUN apt-get install octave octave-statistics -y

#### Install Python packages
USER jovyan
COPY requirements.txt requirements.txt  
RUN pip install -r requirements.txt --upgrade --no-cache-dir

####  General Python packages
RUN jupyter labextension install plotlywidget

#########################################################################
# Run install again but first invalidate the cache
# this will cause the libs to get updated and use the cached dependencies

# Invalidate the cache
ARG NOCACHE

USER root
# LFPy
RUN apt-get update
RUN apt-get install libopenmpi-dev -y

#  Octave etc.
RUN apt-get install octave octave-statistics -y

USER jovyan
#### Install Python packages
RUN pip install -r requirements.txt --upgrade --no-cache-dir

#########################################################################

##############

USER root

### Some aliases
RUN echo -e '\n\nalias cd..="cd .." \nalias h=history \nalias ll="ls -alt" \nalias jnml="java -classpath /opt/conda/lib/python3.9/site-packages/pyneuroml/lib/jNeuroML-*-jar-with-dependencies.jar  org.neuroml.JNeuroML"\n' >> ~/.bashrc
RUN cat ~/.bashrc


################################################################################

USER root

COPY hub/jupyter_notebook_config.py /etc/jupyter/jupyter_notebook_config.py

# RUN chown jovyan /opt
# RUN chown -R jovyan /opt/conda  # give user permission to update existing packages

RUN mkdir -p /opt/workspace && chown jovyan /opt/workspace
RUN mkdir -p /opt/home && chown jovyan /opt/home

USER jovyan
# sym link workspace pvc to $FOLDER
RUN ln -s /opt/workspace workspace

RUN mkdir -p .jupyter/lab
RUN ln -s /opt/workspace .jupyter/lab/workspaces

COPY conf/ .jupyter/lab/user-settings/@jupyterlab

USER root
RUN chown -R jovyan /home/jovyan/.jupyter/lab/user-settings
RUN wget -P `pip show LFPykit | grep "Location:" | awk '{print $2"/lfpykit"}'` https://www.parralab.org/nyhead/sa_nyhead.mat

WORKDIR /opt/workspace
