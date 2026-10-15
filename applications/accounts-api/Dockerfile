ARG CLOUDHARNESS_FLASK

FROM $CLOUDHARNESS_FLASK

ENV MODULE_NAME=accounts_api
ENV WORKERS=2
ENV PORT=8080

COPY backend/requirements.txt /usr/src/app/

RUN pip3 install --no-cache-dir -r requirements.txt

COPY backend /usr/src/app

RUN pip3 install -e .
