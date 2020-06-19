ARG REGISTRY
ARG TAG=latest
FROM ${REGISTRY}cloudharness-base:${TAG}

RUN apk update
RUN apk upgrade
RUN apk add gcc
RUN apk add libc-dev
RUN apk add libffi-dev
RUN apk add openssl-dev

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/
COPY requirements /usr/src/app/requirements

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

EXPOSE 8080

ENV FLASK_ENV=development
# Todo: switch to production
# ENV FLASK_ENV=production

ENTRYPOINT ["python3"]

CMD ["-m", "workspaces"]
