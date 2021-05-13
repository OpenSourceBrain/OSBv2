ARG REGISTRY
ARG TAG=latest
FROM ${REGISTRY}cloudharness-base:${TAG}

RUN apk add subversion

ADD . /

ENV shared_directory /
ENV workspace_id 1

CMD source ./run.sh
