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

### Set up lems, reusing pynml jar
RUN echo -e '#!/bin/bash\n#Reusing the jNeuroML jar from the pip installed pyNeuroML for the lems command\n\njava -classpath /opt/conda/lib/python3.9/site-packages/pyneuroml/lib/jNeuroML-*-jar-with-dependencies.jar org.lemsml.jlems.viz.VizMain $@' >> /opt/conda/bin/lems
RUN chmod +x /opt/conda/bin/lems

RUN cat ~/.bashrc


################################################################################

USER root

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

#  NEST 
ENV NEST_VER=3.5
ENV NEST_HOME=/opt/conda/nest
RUN cd /tmp && \
    wget -nv https://github.com/nest/nest-simulator/archive/v$NEST_VER.tar.gz && \
    tar xvzf v$NEST_VER.tar.gz && \
    mv nest-simulator-$NEST_VER nest && \
    cd nest && \
    mkdir $NEST_HOME && \
    apt-get install libgsl-dev -y && \
    cmake -DCMAKE_INSTALL_PREFIX:PATH=$NEST_HOME -DPYTHON_EXECUTABLE:FILEPATH=/opt/conda/bin/python -DPYTHON_INCLUDE_DIR=/opt/conda/include/python3.9 . && \
    make -j7 && \
    make install
ENV PYTHONPATH=$NEST_HOME/lib/python3.9/site-packages
ENV PATH=$PATH:$NEST_HOME/bin

USER jovyan
#### Install Python packages
RUN pip install -r requirements.txt --upgrade --no-cache-dir

#  Compile NEURON mod files for PyNN
RUN cd /opt/conda/lib/python3.9/site-packages/pyNN/neuron/nmodl && nrnivmodl
# See https://github.com/OpenSourceBrain/osb-model-validation/issues/91 for status of this
RUN pip install 'numpy<=1.23.0' # temp fix for https://levelup.gitconnected.com/fix-attributeerror-module-numpy-has-no-attribute-float-d7d68c5a4971

#########################################################################
# fix for https://github.com/jupyter/notebook/issues/7048
RUN pip install traitlets==5.9.0

COPY --chown=jovyan:users overrides/* /opt/conda/share/jupyter/lab/static/
WORKDIR /opt/workspace
