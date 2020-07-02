FROM node:13.14 as jsbuild
ENV REPO=https://github.com/MetaCell/nwb-explorer.git
ENV BRANCH_TAG=development
ENV FOLDER=nwb-explorer

RUN git clone $REPO -b $BRANCH_TAG $FOLDER
RUN rm -Rf .git
WORKDIR $FOLDER/webapp
RUN npm ci
RUN npm run build
#Remove node_modules, need to keep the geppetto client
RUN mv node_modules/@geppettoengine .
RUN rm -Rf node_modules/*
RUN mv @geppettoengine node_modules

###
FROM jupyter/base-notebook:hub-1.1.0
ENV NB_UID=jovyan
ENV FOLDER=nwb-explorer
USER root

#

COPY --from=jsbuild --chown=1000:1000 $FOLDER $FOLDER
WORKDIR $FOLDER

RUN ls -la webapp/node_modules
RUN apt-get update -qq &&\
    apt-get install python3-tk vim nano unzip -qq
RUN apt-get install git -qq
RUN apt-get install g++ -qq

# Temporary fix for deprecated api usage on some requirement
# RUN pip install setuptools==45

RUN pip install -r requirements.txt --no-cache-dir
RUN jupyter nbextension install --py --symlink --sys-prefix jupyter_geppetto
RUN jupyter nbextension enable --py --sys-prefix jupyter_geppetto
RUN jupyter nbextension enable --py --sys-prefix widgetsnbextension
RUN jupyter serverextension enable --py --sys-prefix jupyter_geppetto

RUN pip install . --no-cache-dir
RUN jupyter labextension disable @jupyterlab/hub-extension

COPY hub/jupyter_notebook_config.py /etc/jupyter/jupyter_notebook_config.py
COPY geppetto/GeppettoConfiguration.json webapp/GeppettoConfiguration.json

USER $NB_UID
CMD ./NWBE


EXPOSE 8888

CMD ./NWBE