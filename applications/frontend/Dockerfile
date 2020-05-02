ARG REGISTRY
ARG TAG=latest
FROM ${REGISTRY}cloudharness-base:${TAG}

RUN apk update
RUN apk upgrade

RUN apk add --update nodejs npm

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install --save-dev --silent

COPY . /usr/src/app
RUN npm run build-dev --silent

EXPOSE 8080

ENTRYPOINT ["npm"]

CMD ["start"]
