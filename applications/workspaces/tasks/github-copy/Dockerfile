ARG REGISTRY
ARG TAG=latest
FROM ${REGISTRY}cloudharness-base:${TAG}

RUN apk add subversion

ADD . /

ENV url 'https://www.google.com'
ENV shared_directory /
ENV folder path/path

CMD env && source ./run.sh
