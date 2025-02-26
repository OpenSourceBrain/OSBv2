FROM python:3.9

COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip &&\ 
    pip install cython  && pip install -r requirements.txt --prefer-binary

ADD . /

ENV shared_directory /
ENV workspace_id 1

RUN chmod +x ./run.sh
CMD ./run.sh
