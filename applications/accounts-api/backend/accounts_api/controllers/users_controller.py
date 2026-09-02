import math

import connexion
import six
from flask import request
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
    if request.is_json:
        user = User.from_dict(request.get_json())  # noqa: E501
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


def get_users(search=None, page=1, per_page=20, sort_by="registration_date", sort_order="desc"):
    """get a page of users

    :param search: free-text filter on username, first/last name or email
    :type search: str
    :param page: 1-based page number
    :type page: int
    :param per_page: page size
    :type per_page: int
    :param sort_by: field to sort by
    :type sort_by: str
    :param sort_order: asc or desc
    :type sort_order: str

    :rtype: {}
    """
    users, total = user_service.get_users(search=search, page=page, per_page=per_page,
                                          sort_by=sort_by, sort_order=sort_order)
    number_of_pages = math.ceil(total / per_page) if per_page else 0
    return {
        'users': users,
        'pagination': {
            'total': total,
            'current_page': page,
            'per_page': per_page,
            'number_of_pages': number_of_pages,
        },
    }


def update_user(userid, user=None):  # noqa: E501
    """get_user

     # noqa: E501

    :param userid: user id
    :type userid: str

    :rtype: User
    """
    if request.is_json:
        user = User.from_dict(request.get_json())  # noqa: E501
    try:
        return user_service.update_user(userid, user)
    except user_service.UserNotFound as e:
        return "User not found", 404
    except user_service.UserNotAuthorized as e:
        return "User not authorized", 401
