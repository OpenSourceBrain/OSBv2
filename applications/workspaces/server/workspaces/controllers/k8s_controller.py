import connexion
import six

from workspaces import util
from workspaces.repository import WorkspaceRepository

def live():  # noqa: E501
    """Test if application is healthy

     # noqa: E501


    :rtype: str
    """
    
    return ready()


def ready():  # noqa: E501
    """Test if application is ready to take requests

     # noqa: E501


    :rtype: str
    """
    
    WorkspaceRepository().check()
    return "ok"
