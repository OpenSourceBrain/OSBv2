ARG REGISTRY
ARG TAG=latest
ARG CLOUDHARNESS_FLASK=${REGISTRY}cloudharness-flask:${TAG}

FROM $CLOUDHARNESS_FLASK

RUN apk update
RUN apk upgrade
RUN apk add gcc
RUN apk add libc-dev
RUN apk add libffi-dev
RUN apk add openssl-dev
RUN apk add postgresql-dev

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/
COPY requirements /usr/src/app/requirements

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

EXPOSE 8080

# ENV FLASK_ENV=production
ENV FLASK_ENV=production
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=8080
ENV PORT=$FLASK_RUN_PORT
ENV FLASK_APP=workspaces.__main__
ENV FLASK_LOG_LEVEL=info

RUN pip3 install -e .
ENTRYPOINT gunicorn --workers=$WORKERS --bind=0.0.0.0:$PORT $FLASK_APP:app