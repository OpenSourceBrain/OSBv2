ARG CLOUDHARNESS_BASE
FROM $CLOUDHARNESS_BASE

# much faster than curl/wget
# https://pkgs.alpinelinux.org/packages?name=aria2&branch=edge
RUN apk add aria2 curl


ADD . /

ENV shared_directory /
ENV workspace_id 1

RUN chmod +x ./run.sh
CMD ./run.sh
