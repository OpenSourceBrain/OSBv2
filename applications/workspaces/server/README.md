# OpenAPI generated server

## Overview
Workspaces manager REST api micro service.

This example uses the [Connexion](https://github.com/zalando/connexion) library on top of Flask.

## Requirements
Python 3.5.2+

## Usage
To run the server, please execute the following from the root directory:

```
cd server
pip3 install -r requirements.txt
python3 -m workspace_manager
```

and open your browser to here:

```
http://localhost:8080/api/ui/
```

Your OpenAPI definition lives here:

```
http://localhost:8080/api/openapi.json
```

To launch the integration tests, use tox:
```
sudo pip install tox
tox
```

## Running with Docker

To run the server on a Docker container, please execute the following from the root directory:

```bash
# building the image
docker build -t workspace-manager .

# starting up a container
docker run -p 8080:8080 workspace-manager
```
