FROM node:13.14 as base
ENV BUILDDIR=/builddir

COPY package.json ${BUILDDIR}/package.json
COPY package-lock.json ${BUILDDIR}/package-lock.json
ENV CH_ACCOUNTS_AUTH_DOMAIN=https://accounts.osb.local/auth/
ENV CH_ACCOUNTS_AUTH_REALM=osb2
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
COPY deploy/nginx.conf /etc/nginx/nginx.conf

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD /entrypoint.sh