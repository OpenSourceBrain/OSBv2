FROM node:14 as jsbuild
ENV REPO=https://github.com/MetaCell/NetPyNE-UI.git
ENV BRANCH_TAG=release/1.0.0
ENV FOLDER=netpyne
RUN echo "no-cache 2023-4-14"
RUN git clone $REPO -b $BRANCH_TAG $FOLDER
RUN rm -Rf .git

COPY overrides/geppetto/GeppettoConfiguration.json $FOLDER/webapp/GeppettoConfiguration.json

WORKDIR $FOLDER/webapp
RUN yarn install  --network-timeout 1000000000
RUN yarn build-dev


RUN mv node_modules/@metacell . && rm -Rf node_modules/* && mv @metacell node_modules


###
FROM jupyter/base-notebook:hub-1.4.2
ENV NB_UID=jovyan
ENV FOLDER=netpyne
ENV NP_LFPYKIT_HEAD_FILE=/home/jovyan/nyhead.mat

USER root

RUN rm -rf /var/lib/apt/lists
RUN apt-get update -qq &&\
    apt-get install python3-tk vim nano unzip git make libtool g++ -qq pkg-config libfreetype6-dev libpng-dev libopenmpi-dev -y
RUN apt-get install openjdk-11-jre-headless -y
RUN conda install python=3.7 -y


WORKDIR $FOLDER
COPY --from=jsbuild --chown=1000:1000 $FOLDER/requirements.txt requirements.txt
RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip &&\
    pip install -r requirements.txt --prefer-binary

COPY --from=jsbuild --chown=1000:1000 $FOLDER .

COPY overrides/hub/jupyter_notebook_config.py /etc/jupyter/jupyter_notebook_config.py


# ToDo: fixme, for now remove the jupyter hub config json file because it overrides the default
# and thus removes the frame ancestor cors settings
RUN rm -f ~/.jupyter/*.json
RUN chown $NB_UID .
RUN chown $NB_UID /opt
RUN rm -Rf workspace

USER $NB_UID

# sym link workspace pvc to $FOLDER
RUN mkdir -p /opt/workspace
RUN mkdir -p /opt/user




ENV NEURON_HOME=/opt/conda


USER root

RUN jupyter nbextension install --py --symlink --sys-prefix jupyter_geppetto
RUN jupyter nbextension enable --py --sys-prefix jupyter_geppetto
RUN jupyter nbextension enable --py --sys-prefix widgetsnbextension
RUN jupyter serverextension enable --py --sys-prefix jupyter_geppetto

RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip &&\ 
  python utilities/install.py --npm-skip --no-test

COPY overrides/requirements.txt overrides/requirements.txt
RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip &&\
    pip install -r overrides/requirements.txt

RUN mv workspace /opt/workspace/tutorials
RUN ln -s /opt/workspace workspace

RUN jupyter labextension disable @jupyterlab/hub-extension


USER $NB_UID


EXPOSE 8888

ENTRYPOINT ["tini", "-g", "--"]



CMD ./NetPyNE-UI
