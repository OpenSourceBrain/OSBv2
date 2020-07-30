FROM node:13.14 as jsbuild
ENV REPO=https://github.com/MetaCell/NetPyNE-UI.git
ENV BRANCH_TAG=master
ENV FOLDER=/home/jovyan/work/netpyne

RUN git clone $REPO -b $BRANCH_TAG $FOLDER
RUN rm -Rf .git
WORKDIR $FOLDER/webapp
RUN npm ci
RUN npm run build-dev
#Remove node_modules, need to keep the geppetto client
RUN mv node_modules/@geppettoengine .
RUN rm -Rf node_modules/*
RUN mv @geppettoengine node_modules

###
FROM frodriguez4600/jupyter-neuron:v7.8.0
ENV NB_UID=jovyan
ENV FOLDER=/home/jovyan/work/netpyne
USER root

COPY --from=jsbuild --chown=1000:1000 $FOLDER $FOLDER
WORKDIR $FOLDER

RUN ls -la webapp/node_modules
RUN rm -rf /var/lib/apt/lists
RUN apt-get update -qq &&\
    apt-get install python3-tk vim nano unzip git g++ -qq
USER $NB_UID
# Temporary fix for deprecated api usage on some requirement
# RUN pip install setuptools==45
RUN ls -la
RUN pip install -r requirements.txt --no-cache-dir
RUN python utilities/install.py --npm-skip

COPY geppetto/GeppettoConfiguration.json webapp/GeppettoConfiguration.json
COPY hub/jupyter_notebook_config.py /etc/jupyter/jupyter_notebook_config.py

EXPOSE 8888
CMD /bin/bash -c "jupyter notebook --NotebookApp.default_url=/geppetto --NotebookApp.token='' --library=netpyne_ui --NotebookApp.disable_check_xsrf=True"



