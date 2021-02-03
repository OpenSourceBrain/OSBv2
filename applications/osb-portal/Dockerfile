FROM node:13.14 as base
ARG DOMAIN=v2.opensourcebrain.org
ARG NAMESPACE=osb2
ENV BUILDDIR=/builddir
RUN npm install -g yarn
COPY package.json ${BUILDDIR}/package.json
COPY yarn.lock ${BUILDDIR}/yarn.lock
WORKDIR ${BUILDDIR}
RUN yarn install
COPY . $BUILDDIR
RUN yarn build
###
FROM nginx:1.17-alpine
ENV BUILDDIR=/builddir
COPY --from=base $BUILDDIR/public /usr/share/nginx/html

EXPOSE 80

yarn start