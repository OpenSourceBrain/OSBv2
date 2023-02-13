FROM node:19.6.0 as base
ENV BUILDDIR=/builddir

COPY package.json ${BUILDDIR}/package.json
COPY yarn.lock ${BUILDDIR}/yarn.lock
WORKDIR ${BUILDDIR}
RUN yarn --timeout 300000
COPY . $BUILDDIR
RUN yarn build
###
FROM nginx:1.17-alpine
ENV BUILDDIR=/builddir
COPY --from=base $BUILDDIR/public /usr/share/nginx/html

EXPOSE 80

RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig
COPY nginx.conf /etc/nginx/nginx.conf

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD /entrypoint.sh