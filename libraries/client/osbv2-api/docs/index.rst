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

Documentation
-------------

The generated API documentation for the workspace models and endpoints is kept
under ``docs/apidocs`` and is maintained by the generation script, so it is
included here with a glob rather than a single index page.

.. toctree::
   :maxdepth: 1
   :caption: Generated API documentation (workspaces)
   :glob:

   apidocs/workspaces/*

.. toctree::
   :maxdepth: 1
   :caption: Python API reference

   api
