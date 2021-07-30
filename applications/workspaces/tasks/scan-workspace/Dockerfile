ARG CLOUDHARNESS_BASE
FROM $CLOUDHARNESS_BASE

RUN apk add subversion

ADD . /

ENV shared_directory /
ENV workspace_id 123
ENV queue queue

CMD python main.py ${shared_directory} ${workspace_id} ${queue}
