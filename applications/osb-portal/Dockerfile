FROM node:13.14 as base
ENV BUILDDIR=/builddir

COPY package.json ${BUILDDIR}
COPY package-lock.json ${BUILDDIR}
WORKDIR ${BUILDDIR}
RUN npm ci
COPY . $BUILDDIR
RUN npm run build
RUN ls -la
###
FROM nginx:1.17-alpine
ENV BUILDDIR=/builddir
COPY --from=base $BUILDDIR/public /usr/share/nginx/html

EXPOSE 80

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD /entrypoint.sh