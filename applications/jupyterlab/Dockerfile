FROM quay.io/jupyter/base-notebook:python-3.12
USER root


####  General packages via apt-get

RUN apt-get update &&  apt-get install -y graphviz openjdk-11-jre-headless git vim htop ncdu make cmake libncurses-dev g++ \
    #LFPy dependencies
    libopenmpi-dev \ 
    #  Octave etc.
    octave octave-statistics
################################################################################

RUN mkdir -p /home/jovyan/.cache/conda && ls -alt /home/jovyan/.cache && chown -R jovyan /home/jovyan/.cache  # give user permission to update existing packages


#### Install Python packages
USER jovyan
COPY requirements.txt requirements.txt  
RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip setuptools &&\
    pip install -r requirements.txt --upgrade --no-cache-dir

RUN conda install pytorch torchvision cpuonly -c pytorch

####  General Python packages
####RUN jupyter labextension install plotlywidget


##############

USER root

### Some aliases
RUN echo -e '\n\nalias cd..="cd .." \nalias h=history \nalias ll="ls -alt" \n' >> ~/.bashrc


### Set up lems, reusing pynml jar
RUN echo -e '#!/bin/bash\n#Reusing the jNeuroML jar from the pip installed pyNeuroML for the lems command\n\njava -classpath /opt/conda/lib/python3.12/site-packages/pyneuroml/lib/jNeuroML-*-jar-with-dependencies.jar org.lemsml.jlems.viz.VizMain $@' >> /opt/conda/bin/lems
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
RUN chown -R jovyan /home/jovyan/.jupyter/lab/user-settings /home/jovyan/.cache

RUN wget --no-verbose -P `pip show LFPykit | grep "Location:" | awk '{print $2"/lfpykit"}'` https://www.parralab.org/nyhead/sa_nyhead.mat

#########################################################################
# Run install again but first invalidate the cache
# this will cause the libs to get updated and use the cached dependencies

# Invalidate the cache
ARG NOCACHE

USER root

#  NEST 
RUN conda install conda-forge::nest-simulator
ENV NEST_HOME=/opt/conda

#### Install Python packages (as root to avoid permission issues with conda-managed packages)

RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip && \ 
    pip install backports.tarfile>=1.2 # temp fix for error: ImportError: cannot import name 'tarfile' from 'backports'
RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip &&\ 
    pip install -r requirements.txt --upgrade --no-cache-dir

USER jovyan

#  Compile NEURON mod files for PyNN
RUN cd /opt/conda/lib/python3.12/site-packages/pyNN/neuron/nmodl && nrnivmodl

# Install NeuroML Schemas etc.
RUN git clone https://github.com/NeuroML/NeuroML2

# Install XPP
RUN git clone https://github.com/NeuroML/xppaut
USER root
RUN apt-get update && apt install -y libx11-dev && cd xppaut && make -j4
USER jovyan
ENV XPP_HOME=/home/jovyan/xppaut
ENV PATH=$PATH:$XPP_HOME

#########################################################################
# fix for https://github.com/jupyter/notebook/issues/7048
RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip &&\ 
    pip install traitlets==5.9.0

COPY --chown=jovyan:users overrides/* /opt/conda/share/jupyter/lab/static/
RUN cp /opt/conda/share/jupyter/lab/static/main*.js /opt/conda/share/jupyter/lab/static/main.js
WORKDIR /opt/workspace
