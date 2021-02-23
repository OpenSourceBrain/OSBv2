FROM node:13.14 as base
ENV BUILDDIR=/builddir

COPY package.json ${BUILDDIR}/package.json
COPY package-lock.json ${BUILDDIR}/package-lock.json
WORKDIR ${BUILDDIR}
RUN npm ci
COPY . $BUILDDIR
RUN npm run build
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