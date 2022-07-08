FROM node:13.14 as jsbuild
ENV REPO=https://github.com/MetaCell/NetPyNE-UI.git
ENV BRANCH_TAG=osb2-dev
ENV FOLDER=netpyne
RUN echo "no-cache 2022-07-08:2"
RUN git clone $REPO -b $BRANCH_TAG $FOLDER
RUN rm -Rf .git

COPY overrides/geppetto/GeppettoConfiguration.json $FOLDER/webapp/GeppettoConfiguration.json

WORKDIR $FOLDER/webapp
RUN yarn install  --network-timeout 1000000000
RUN yarn build-dev


RUN mv node_modules/@metacell .
RUN rm -Rf node_modules/*
RUN mv @metacell node_modules

###
FROM jupyter/base-notebook:hub-1.4.2
ENV NB_UID=jovyan
ENV FOLDER=netpyne
# ENV NETPYNE_CORE_REPO=https://github.com/Neurosim-lab/netpyne
# ENV NETPYNE_CORE_BRANCH_TAG=osbv2

USER root

RUN rm -rf /var/lib/apt/lists
RUN apt-get update -qq &&\
    apt-get install python3-tk vim nano unzip git make libtool g++ -qq pkg-config libfreetype6-dev libpng-dev libopenmpi-dev -y
RUN conda install python=3.7 -y


WORKDIR $FOLDER
COPY --from=jsbuild --chown=1000:1000 $FOLDER/requirements.txt requirements.txt
RUN pip install -r requirements.txt --no-cache-dir --prefer-binary

COPY --from=jsbuild --chown=1000:1000 $FOLDER .



# Temporary fix for deprecated api usage on some requirement
# RUN pip install setuptools==45

#RUN conda install pandas=0.23.4 -y

RUN jupyter nbextension install --py --symlink --sys-prefix jupyter_geppetto
RUN jupyter nbextension enable --py --sys-prefix jupyter_geppetto
RUN jupyter nbextension enable --py --sys-prefix widgetsnbextension
RUN jupyter serverextension enable --py --sys-prefix jupyter_geppetto

RUN python utilities/install.py --npm-skip --workspace=

# # Install specific version of NetPyNE
# RUN pip uninstall netpyne -y
# RUN git clone $NETPYNE_CORE_REPO -b $NETPYNE_CORE_BRANCH_TAG
# RUN cd netpyne ; python setup.py install; cd -

RUN jupyter labextension disable @jupyterlab/hub-extension



USER root
COPY overrides/hub/jupyter_notebook_config.py /etc/jupyter/jupyter_notebook_config.py


# ToDo: fixme, for now remove the jupyter hub config json file because it overrides the default
# and thus removes the frame ancestor cors settings
RUN rm -f ~/.jupyter/*.json
RUN chown $NB_UID .
RUN chown $NB_UID /opt
RUN wget -P `pip show LFPykit | grep "Location:" | awk '{print $2"/lfpykit"}'` https://www.parralab.org/nyhead/sa_nyhead.mat
USER $NB_UID

# sym link workspace pvc to $FOLDER
RUN mkdir -p /opt/workspace
RUN mkdir -p /opt/user
RUN ln -s /opt/workspace workspace

ENV NEURON_HOME=/opt/conda

EXPOSE 8888

ENTRYPOINT ["tini", "-g", "--"]
CMD ./NetPyNE-UI
