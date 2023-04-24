cloudharness keycloak authenticator
===================================

Authenticator to use Jupyterhub with the keycloak gatekeeper.


Running Tests:
--------------

.. code-block:: bash

    pip install -r test-requirements.txt
    pip install -e .
    pytest

PyTest does a lot of caching and may run into troubles if old files linger around.
Use one ore more of the following commands to clean up before running pytest.

.. code-block:: bash

    find ./ -name '*.pyc' -delete
