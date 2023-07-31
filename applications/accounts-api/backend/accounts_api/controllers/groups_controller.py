import connexion
import six
from typing import Dict
from typing import Tuple
from typing import Union

from accounts_api.models.group import Group  # noqa: E501
from accounts_api.models.user import User  # noqa: E501
from accounts_api import util

from accounts_api.services import group_service

def get_group(groupname):  # noqa: E501
    """get_group

     # noqa: E501

    :param groupname: 
    :type groupname: str

    :rtype: Union[Group, Tuple[Group, int], Tuple[Group, int, Dict[str, str]]
    """
    try:
        return group_service.get_group_by_name(groupname)
    except group_service.GroupNotFound as e:
        return "Group not found", 404



def get_group_users(groupname):  # noqa: E501
    """get_group_users

     # noqa: E501

    :param groupname: 
    :type groupname: str

    :rtype: Union[Group, Tuple[Group, int], Tuple[Group, int, Dict[str, str]]
    """
    try:
        return group_service.get_group_users(groupname)
    except group_service.GroupNotFound as e:
        return "Group not found", 404


def update_group(groupname, request_body):  # noqa: E501
    """update_group

     # noqa: E501

    :param groupname: 
    :type groupname: str
    :param request_body: 
    :type request_body: Dict[str, ]

    :rtype: Union[User, Tuple[User, int], Tuple[User, int, Dict[str, str]]
    """
    return 'do some magic!'
