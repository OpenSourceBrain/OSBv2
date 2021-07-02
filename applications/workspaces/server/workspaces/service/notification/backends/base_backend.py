import abc
import os

from cloudharness import log as logger
from flask import render_template
from workspaces.service.auth import get_auth_client


class NotificationBaseBackend(metaclass=abc.ABCMeta):
    def __init__(self, *args, **kwargs):
        """
        Init the notification backend

        """
        pass

    @abc.abstractmethod
    def send(self):
        """
        Send the notification
        """
        raise NotImplementedError
