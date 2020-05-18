import os
import jwt
import sys
import json
import requests
from urllib.parse import urljoin
from typing import List
from flask import current_app
from cloudharness.utils import env
from flask import request


def get_keycloak_data():
    bearer = request.headers.get('Authorization', None)
    current_app.logger.debug(f'Bearer: {bearer}')
    if not bearer or bearer == 'Bearer undefined':
        decoded_token = None
        keycloak_id = -1  # No authorization --> no user --> only publicable workspaces
    else:
        token = bearer.split(' ')[1]
        decoded_token = _decode_token(token)
        keycloak_id = decoded_token['sub']
    return keycloak_id, decoded_token


def _decode_token(token):
    """
    Check and retrieve authentication information from custom bearer token.
    Returned value will be passed in 'token_info' parameter of your operation function, if there is one.
    'sub' or 'uid' will be set in 'user' parameter of your operation function, if there is one.

    :param token Token provided by Authorization header
    :type token: str
    :return: Decoded token information or None if token is invalid
    :rtype: dict | None
    """
    SCHEMA = 'http://'
    AUTH_SERVICE_HOST = env.get_variable('ACCOUNTS_SERVICE_HOST')
    AUTH_SERVICE_PORT = env.get_variable('ACCOUNTS_SERVICE_PORT')
    AUTH_DOMAIN = f'{AUTH_SERVICE_HOST}:{AUTH_SERVICE_PORT}'
    AUTH_REALM = env.get_variable('CH_ACCOUNTS_REALM')
    BASE_PATH = f'{AUTH_DOMAIN}/auth/realms/{AUTH_REALM}'
    AUTH_PUBLIC_KEY_URL = f'{SCHEMA}{BASE_PATH}'
    current_app.logger.debug(f'auth pub key url: {AUTH_PUBLIC_KEY_URL}')

    KEY = json.loads(requests.get(AUTH_PUBLIC_KEY_URL, verify=False).text)['public_key']
    KEY = b"-----BEGIN PUBLIC KEY-----\n" + str.encode(KEY) + b"\n-----END PUBLIC KEY-----"

    decoded = jwt.decode(token, KEY, algorithms='RS256', audience='account')

    valid = 'offline_access' in decoded['realm_access']['roles']
    current_app.logger.debug(valid)
    return decoded