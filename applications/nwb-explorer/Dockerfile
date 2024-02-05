FROM node:20 as jsbuild


ENV FOLDER=nwb-explorer

WORKDIR $FOLDER/webapp

COPY dependencies/nwb-explorer/webapp/package.json .
COPY dependencies/nwb-explorer/webapp/yarn.lock .
RUN yarn install --network-timeout 1000000000
COPY dependencies/nwb-explorer/webapp/ .
COPY geppetto/GeppettoConfiguration.json GeppettoConfiguration.json
RUN yarn build


###
FROM jupyter/base-notebook:hub-1.5.0
ENV NB_UID=jovyan
ENV FOLDER=nwb-explorer
USER root

#

WORKDIR $FOLDER

RUN rm -rf /var/lib/apt/lists
RUN apt-get update -qq &&\
    apt-get install python3-tk vim nano unzip git g++ libjpeg-dev zlib1g-dev -qq


RUN chown $NB_UID /opt
RUN chown $NB_UID .

USER $NB_UID

COPY dependencies/nwb-explorer/requirements.txt requirements.txt
RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip &&\ 
    pip install -r requirements.txt
RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip &&\ 
    pip install cython --no-cache-dir
COPY dependencies/nwb-explorer/ .


RUN mkdir -p /opt/workspace
RUN ln -s /opt/workspace workspace
RUN mkdir -p /opt/home
RUN python utilities/install.py --npm-skip --no-test
COPY dependencies/nwb-explorer/utilities/custom.css /home/jovyan/.jupyter/custom/custom.css

# this removes the frame ancestor default cors settings
RUN rm -f ~/.jupyter/*.json

USER root
# sym link workspace pvc to $FOLDER
RUN chown -R $NB_UID /opt/conda/etc/jupyter/nbconfig

RUN chown $NB_UID .
COPY --from=jsbuild --chown=$NB_UID:$NB_UID $FOLDER/webapp/build webapp/build

USER $NB_UID
CMD ./NWBE