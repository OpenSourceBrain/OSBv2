FROM node:15 as clone
ENV BRANCH_TAG="osb2"
ENV REPO=https://github.com/MetaCell/nwb-explorer.git
RUN echo "cache 2022-09-30"
RUN git clone $REPO -b $BRANCH_TAG
RUN rm -Rf .git

FROM node:15 as jsbuild


ENV FOLDER=nwb-explorer



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
RUN pip install cython --no-cache-dir
# Temporary fix for deprecated api usage on some requirement
# RUN pip install setuptools==45

COPY --from=clone $FOLDER/requirements.txt requirements.txt
RUN pip install -r requirements.txt --no-cache-dir
COPY --from=clone $FOLDER .



RUN chown $NB_UID /opt
RUN chown $NB_UID .

RUN chown -R $NB_UID /opt/conda/etc/jupyter/nbconfig
USER $NB_UID

RUN mkdir -p /opt/workspace
RUN ln -s /opt/workspace workspace
RUN mkdir -p /opt/home
RUN python utilities/install.py --npm-skip --no-test
COPY hub/jupyter_notebook_config.py /etc/jupyter/jupyter_notebook_config.py

# this removes the frame ancestor default cors settings
RUN rm -f ~/.jupyter/*.json

USER root
# sym link workspace pvc to $FOLDER
RUN chown $NB_UID .
COPY --from=jsbuild --chown=$NB_UID:$NB_UID $FOLDER/webapp/build webapp/build
COPY --from=jsbuild --chown=$NB_UID:$NB_UID $FOLDER/webapp/node_modules/@geppettoengine webapp/node_modules/@geppettoengine

USER $NB_UID
CMD ./NWBE