osbv2-api
=========

``osbv2-api`` is the generated Python client library for the OSBv2 REST API. It
provides typed models and endpoint classes for the OSBv2 workspaces API, so
Python code can create, read, update and delete workspaces and their resources
without hand-written HTTP handling.

Installation
------------

Install the package from the repository root of this client library:

.. code-block:: bash

   pip install .

Running the tests
-----------------

The test-suite is run with ``pytest`` from the same directory:

.. code-block:: bash

   pytest

Python API reference
--------------------

The Python client package ``osbv2_api`` is documented with autodoc and
``autosummary`` on the following page:

.. toctree::
   :maxdepth: 1

   api

REST API reference (generated from openapi.yaml)
------------------------------------------------

The generated API documentation for the workspace models and endpoints is kept
under ``docs/apidocs`` and is maintained by the generation script, so it is
included here with a glob rather than a single index page. These Markdown pages
are produced by ``regenerate.sh`` and must not be hand-edited.

.. toctree::
   :maxdepth: 1
   :glob:

   apidocs/workspaces/*
