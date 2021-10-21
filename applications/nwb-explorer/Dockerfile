FROM node:15 as clone
ENV BRANCH_TAG="osb2"
ENV REPO=https://github.com/MetaCell/nwb-explorer.git
RUN git clone $REPO -b $BRANCH_TAG
RUN rm -Rf .git

FROM node:15 as jsbuild


ENV FOLDER=nwb-explorer
RUN echo "cache 2021-07-01"


WORKDIR $FOLDER/webapp

COPY --from=clone nwb-explorer/webapp/package.json .
COPY --from=clone nwb-explorer/webapp/package-lock.json .
RUN npm ci
COPY --from=clone nwb-explorer/webapp/ .
COPY geppetto/GeppettoConfiguration.json GeppettoConfiguration.json
RUN npm run build


###
FROM jupyter/base-notebook:hub-1.4.2
ENV NB_UID=jovyan
ENV FOLDER=nwb-explorer
USER root

#

WORKDIR $FOLDER

RUN rm -rf /var/lib/apt/lists
RUN apt-get update -qq &&\
    apt-get install python3-tk vim nano unzip git g++ libjpeg-dev zlib1g-dev -qq
RUN pip install cython
# Temporary fix for deprecated api usage on some requirement
# RUN pip install setuptools==45

COPY --from=clone --chown=1000:1000 $FOLDER/requirements.txt requirements.txt
RUN pip install -r requirements.txt --no-cache-dir
COPY --from=clone --chown=1000:1000 $FOLDER .
RUN python utilities/install.py --npm-skip --no-test

COPY hub/jupyter_notebook_config.py /etc/jupyter/jupyter_notebook_config.py

# this removes the frame ancestor default cors settings
RUN rm -f ~/.jupyter/*.json


RUN chown $NB_UID /opt
RUN chown $NB_UID .
USER $NB_UID
# sym link workspace pvc to $FOLDER
RUN mkdir -p /opt/workspace
RUN mkdir -p /opt/home
RUN ln -s /opt/workspace workspace
COPY --from=jsbuild --chown=$NB_UID:1000 $FOLDER/webapp/build webapp/build
COPY --from=jsbuild --chown=$NB_UID:1000 $FOLDER/webapp/node_modules/@geppettoengine webapp/node_modules/@geppettoengine

CMD ./NWBE