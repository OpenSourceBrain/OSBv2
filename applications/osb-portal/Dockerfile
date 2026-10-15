FROM node:20-slim as base
ENV BUILDDIR=/builddir

COPY package.json ${BUILDDIR}/package.json
COPY yarn.lock ${BUILDDIR}/yarn.lock
WORKDIR ${BUILDDIR}
RUN yarn install --frozen-lockfile --timeout 6000000
COPY . $BUILDDIR
RUN yarn build 
###
FROM nginx:stable
ENV BUILDDIR=/builddir
COPY --from=base $BUILDDIR/public /usr/share/nginx/html

EXPOSE 80

RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig
COPY nginx.conf /etc/nginx/nginx.conf

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD /entrypoint.sh
