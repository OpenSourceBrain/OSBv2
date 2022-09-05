FROM jupyter/base-notebook:hub-1.4.2
USER root


RUN apt-get update

####  General packages via apt-get

RUN apt-get install graphviz -y
RUN apt-get install openjdk-11-jre-headless -y

RUN apt-get install git vim htop ncdu -y      # git and general utilities
RUN apt-get install make cmake libncurses-dev g++ -y  # make etc. to allow NEURON`s nrnivmodl

################################################################################

#### Install needed linux packages

# LFPy
RUN apt-get install libopenmpi-dev -y

####  Octave etc.
RUN apt-get install octave octave-statistics -y

# Invalidate build cache to install latest of libopenmpi and octave and pip packages
# doing it here and repeat the apt-get will still use the cache for the dependencies
ARG NOCACHE

# LFPy
RUN apt-get install libopenmpi-dev -y

####  Octave etc.
RUN apt-get install octave octave-statistics -y

#### Change to "user" mode and install the python packages
USER jovyan

####  NeuroML etc.
RUN pip install pyneuroml pyelectro --no-cache-dir
RUN pip install git+https://github.com/NeuralEnsemble/neurotune.git --no-cache-dir


####  NEURON & NetPyNE
RUN pip install neuron --no-cache-dir
ENV NEURON_HOME=/opt/conda

# Install specific version of NetPyNE
ENV NETPYNE_CORE_REPO=https://github.com/Neurosim-lab/netpyne
ENV NETPYNE_CORE_BRANCH_TAG=osbv2
RUN git clone --depth=1 $NETPYNE_CORE_REPO -b $NETPYNE_CORE_BRANCH_TAG
RUN cd netpyne ; python setup.py install; cd -

####  Other simulators

# Arbor
RUN pip install arbor --no-cache-dir

# Brian
RUN pip install brian2 brian2tools --no-cache-dir

# PyNN
RUN pip install pynn==0.10.0 --no-cache-dir

# elephant
RUN pip install elephant --no-cache-dir

# LFPy
RUN pip install lfpy --no-cache-dir

####  Octave etc.
RUN pip install octave_kernel --no-cache-dir


####  NWB
RUN pip install pynwb ipywidgets seaborn --no-cache-dir # nwbwidgets  # v big increase in size...


####  Machine learning libs

# Note: this just installs pytorch for cpu, the default install adds a v large cuda lib
RUN pip install torch==1.11.0+cpu -f https://download.pytorch.org/whl/torch_stable.html --no-cache-dir

# For MDF
RUN pip install git+https://github.com/SheffieldML/GPy.git@devel
RUN pip install dask==2.30.0 distributed==2.30.1 protobuf==3.17.0
RUN pip install git+https://github.com/SheffieldML/GPy.git@devel
#RUN pip install modeci_mdf==0.3.3 # big jump in size of image...

RUN pip install sklearn # Required for some Neuromatch Academy material
RUN pip install fasttext # Required for some Neuromatch Academy material


####  TVB etc.
RUN pip install tvb-library --no-cache-dir
RUN pip install tvb-data
RUN pip install ipympl --no-cache-dir


####  General Python packages
RUN pip install plotly
RUN jupyter labextension install plotlywidget


####  Final updates
RUN pip install --upgrade numpy  # Removes some issues with LFPy...


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
# RUN chown -R jovyan /home/jovyan/.jupyter/lab/user-settings

WORKDIR /opt/workspace
