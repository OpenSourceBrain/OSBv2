ARG CLOUDHARNESS_BASE
FROM $CLOUDHARNESS_BASE

RUN apk add git

ADD . /

ENV shared_directory /
ENV workspace_id 1

CMD source ./run.sh
