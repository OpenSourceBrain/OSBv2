FROM jupyter/base-notebook:hub-1.5.0
USER root


####  General packages via apt-get

RUN apt-get update &&  apt-get install graphviz openjdk-11-jre-headless git vim htop ncdu make cmake libncurses-dev g++ -y

################################################################################

####  NeuroML etc.
ENV NEURON_HOME=/opt/conda
ENV NETPYNE_CORE_REPO=https://github.com/Neurosim-lab/netpyne
ENV NETPYNE_CORE_BRANCH_TAG=osbv2

#### Install needed linux packages

USER root
# LFPy
RUN apt-get update && apt-get install libopenmpi-dev -y

####  Octave etc.
RUN apt-get update && apt-get install octave octave-statistics -y

#### Install Python packages
USER jovyan
COPY requirements.txt requirements.txt  
RUN pip install -r requirements.txt --upgrade --no-cache-dir

####  General Python packages
RUN jupyter labextension install plotlywidget



##############

USER root

### Some aliases
RUN echo -e '\n\nalias cd..="cd .." \nalias h=history \nalias ll="ls -alt" \n' >> ~/.bashrc

### Set up jnml, reusing pynml jar
RUN echo -e '#!/bin/bash\n#Reusing the jNeuroML jar from the pip installed pyNeuroML for the jnml command\n\njava -classpath /opt/conda/lib/python3.9/site-packages/pyneuroml/lib/jNeuroML-*-jar-with-dependencies.jar  org.neuroml.JNeuroML $@' >> /opt/conda/bin/jnml
RUN chmod +x /opt/conda/bin/jnml
ENV JNML_HOME=/opt/conda/bin

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
RUN wget --no-verbose -P `pip show LFPykit | grep "Location:" | awk '{print $2"/lfpykit"}'` https://www.parralab.org/nyhead/sa_nyhead.mat

#########################################################################
# Run install again but first invalidate the cache
# this will cause the libs to get updated and use the cached dependencies

# Invalidate the cache
ARG NOCACHE

USER root
# LFPy 
RUN apt-get update && apt-get install libopenmpi-dev -y

#  Octave etc.
RUN apt-get update && apt-get install octave octave-statistics -y

USER jovyan
#### Install Python packages
RUN pip install -r requirements.txt --upgrade --no-cache-dir

#########################################################################

COPY overrides/* /opt/conda/share/jupyter/lab/static/
WORKDIR /opt/workspace
