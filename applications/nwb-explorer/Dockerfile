FROM node:15 as jsbuild
ENV REPO=https://github.com/MetaCell/nwb-explorer.git
ENV BRANCH_TAG="development"
ENV FOLDER=nwb-explorer
RUN git clone $REPO -b $BRANCH_TAG $FOLDER
RUN rm -Rf .git

COPY geppetto/GeppettoConfiguration.json $FOLDER/webapp/GeppettoConfiguration.json

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


WORKDIR $FOLDER

RUN rm -rf /var/lib/apt/lists
RUN apt-get update -qq &&\
    apt-get install python3-tk vim nano unzip git g++ -qq

# Temporary fix for deprecated api usage on some requirement
# RUN pip install setuptools==45

COPY --from=jsbuild --chown=1000:1000 $FOLDER/requirements.txt requirements.txt
RUN pip install -r requirements.txt --no-cache-dir
COPY --from=jsbuild --chown=1000:1000 $FOLDER .
RUN python utilities/install.py --npm-skip --no-test

COPY hub/jupyter_notebook_config.py /etc/jupyter/jupyter_notebook_config.py

# this removes the frame ancestor default cors settings
RUN rm -f ~/.jupyter/*.json

# sym link workspace pvc to $FOLDER
RUN mkdir -p /opt/workspace
RUN mkdir -p /opt/home
RUN chown -R $NB_UID /opt/*
RUN ln -s /opt/workspace ./workspace
RUN ln -s /opt/user ./user



USER $NB_UID
CMD ./NWBE