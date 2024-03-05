FROM gcr.io/metacellllc/netpyne-ui:npa103201

COPY overrides/requirements.txt overrides/requirements.txt
RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip &&\
    pip install -r overrides/requirements.txt
