FROM node:13.14 as jsbuild
ENV REPO=https://github.com/MetaCell/NetPyNE-UI.git
ENV BRANCH_TAG=development
ENV FOLDER=netpyne

RUN git clone $REPO -b $BRANCH_TAG $FOLDER
RUN rm -Rf .git

COPY geppetto/GeppettoConfiguration.json $FOLDER/webapp/GeppettoConfiguration.json

WORKDIR $FOLDER/webapp
RUN npm ci
RUN npm run build-dev
#Remove node_modules, need to keep the geppetto client
RUN mv node_modules/@geppettoengine .
RUN rm -Rf node_modules/*
RUN mv @geppettoengine node_modules

###
FROM jupyter/base-notebook:hub-1.1.0
ENV NB_UID=jovyan
ENV FOLDER=netpyne

COPY --from=jsbuild --chown=1000:1000 $FOLDER $FOLDER
WORKDIR $FOLDER

USER root

RUN ls -la webapp/node_modules
RUN rm -rf /var/lib/apt/lists
RUN apt-get update -qq &&\
    apt-get install python3-tk vim nano unzip git make libtool g++ -qq pkg-config libfreetype6-dev libpng-dev

# Temporary fix for deprecated api usage on some requirement
# RUN pip install setuptools==45

RUN conda install python=3.7 -y
#RUN conda install pandas=0.23.4 -y
RUN pip install -r requirements.txt --no-cache-dir --prefer-binary
RUN jupyter nbextension install --py --symlink --sys-prefix jupyter_geppetto
RUN jupyter nbextension enable --py --sys-prefix jupyter_geppetto
RUN jupyter nbextension enable --py --sys-prefix widgetsnbextension
RUN jupyter serverextension enable --py --sys-prefix jupyter_geppetto

RUN python utilities/install.py --npm-skip
RUN jupyter labextension disable @jupyterlab/hub-extension

COPY hub/jupyter_notebook_config.py /etc/jupyter/jupyter_notebook_config.py

# sym link workspace pvc to $FOLDER
RUN mkdir -p /opt/workspace
RUN mkdir -p /opt/home
RUN chown -R jovyan /opt/*
RUN ln -s /opt/workspace ./netpyne_workspace
RUN ln -s /opt/home ./netpyne_workspace

# ToDo: fixme, for now remove the jupyter hub config json file because it overrides the default
# and thus removes the frame ancestor cors settings
RUN rm -f ~/.jupyter/*.json

COPY ./NETPYNE .
RUN chmod +x NETPYNE
RUN chown -R $NB_UID ..
USER $NB_UID

EXPOSE 8888

ENTRYPOINT ["tini", "-g", "--"]
CMD ./NETPYNE
