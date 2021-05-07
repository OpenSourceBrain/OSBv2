ARG REGISTRY
ARG TAG=latest
FROM ${REGISTRY}cloudharness-base:${TAG}

RUN apk add subversion

ADD . /

ENV shared_directory /
ENV workspace_id 123
ENV queue queue

CMD python main.py ${shared_directory} ${workspace_id} ${queue}
