FROM node:13.14 as base
ENV BUILDDIR=/builddir
COPY . $BUILDDIR

WORKDIR ${BUILDDIR}
RUN npm ci
RUN npm run build
RUN ls -la
###
FROM nginx:1.17-alpine
ENV BUILDDIR=/builddir
COPY --from=base $BUILDDIR/public /usr/share/nginx/html

EXPOSE 80