<p align="center">
<img src="http://www.opensourcebrain.org/images/osbcircle.png" alt="drawing" width="200"/>
</p>

# Workspaces manager backend
The workspace manager is pure microservice rest api.
It's defined with API first approach with Openapi v3 and implemented as a Flask application.
Use a postgres database as a backend, with api-first ORM mapping.


## Build / run

```
cd server

# setup virtual env
python3.7 -m venv venv

# install dependencies
pip install --no-cache-dir -r requirements.txt

# activate virtual env
source venv/bin/activate

# run flask backend
export FLASK_ENV=development
python -m workspaces
```

Open your browser and go to  http://0.0.0.0:8080/api/ui/ to see the REST api ui

When running in Cloudharness the url for the api ui is https://workspaces.cloudharness.metacell.us/api/ui/

## Tech

Workspaces uses openapi for definition of the (REST) api .

The database model is generated via OpenAlchemy. For more information about OpenAlchemy see https://pypi.org/project/OpenAlchemy/

This application is based on Flask

Configuration of the server can be changed in the config.py file