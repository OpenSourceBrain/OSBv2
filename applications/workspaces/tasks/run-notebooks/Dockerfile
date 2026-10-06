FROM python:3.12

# papermill executes the notebooks; ipykernel provides the "python3" kernel they ask for. The
# repository's own dependencies come from its requirements.txt at run time.
RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip && \
    pip install --prefer-binary papermill ipykernel && \
    python -m ipykernel install --sys-prefix --name python3

ADD run.sh /run.sh

RUN chmod +x /run.sh
CMD ["/run.sh"]
