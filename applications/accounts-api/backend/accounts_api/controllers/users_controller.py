import connexion
import six
from cloudharness.auth import AuthClient
from accounts_api.models.user import User  # noqa: E501
from accounts_api import util


from accounts_api.services import user_service

def create_user(user):  # noqa: E501
    """create_user

     # noqa: E501

    :param user: 
    :type user: dict | bytes

    :rtype: User
    """
    if connexion.request.is_json:
        user = User.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def get_user(userid):  # noqa: E501
    """get_user

     # noqa: E501

    :param userid: user id
    :type userid: str

    :rtype: User
    """
    try:
        return user_service.get_user(userid)
    except user_service.UserNotFound as e:
        return "User not found", 404


def get_users(query={}):
    """get all users

    :param query: user filter
    :type query: str

    :rtype: {}
    """

    return {'users': user_service.get_users(query)}


def update_user(userid, user=None):  # noqa: E501
    """get_user

     # noqa: E501

    :param userid: user id
    :type userid: str

    :rtype: User
    """
    if connexion.request.is_json:
        user = User.from_dict(connexion.request.get_json())  # noqa: E501
    try:
        return user_service.update_user(userid, user)
    except user_service.UserNotFound as e:
        return "User not found", 404
    except user_service.UserNotAuthorized as e:
        return "User not authorized", 401
