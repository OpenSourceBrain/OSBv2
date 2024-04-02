FROM python:3.9

RUN pip install --no-cache-dir #TODO

ADD . /

ENV shared_directory /
ENV workspace_id 1

RUN chmod +x ./run.sh
CMD ./run.sh
