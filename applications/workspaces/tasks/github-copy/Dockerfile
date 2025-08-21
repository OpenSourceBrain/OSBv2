ARG CLOUDHARNESS_BASE
FROM $CLOUDHARNESS_BASE

RUN apt-get update && apt-get install -y git

ADD . /

ENV shared_directory /
ENV workspace_id 1
RUN chmod +x ./run.sh
CMD [sh, -c, './run.sh']
