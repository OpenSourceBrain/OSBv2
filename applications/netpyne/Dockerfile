FROM gcr.io/metacellllc/netpyne-ui:1.0.0-osb

COPY overrides/requirements.txt overrides/requirements.txt
RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip &&\
    pip install -r overrides/requirements.txt
