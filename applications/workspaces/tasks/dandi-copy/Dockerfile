ARG CLOUDHARNESS_BASE_DEBIAN
FROM $CLOUDHARNESS_BASE_DEBIAN

RUN pip install --no-cache-dir dandi pydantic[email]

ADD . /

ENV shared_directory /
ENV workspace_id 1

RUN chmod +x ./run.sh
CMD ./run.sh
