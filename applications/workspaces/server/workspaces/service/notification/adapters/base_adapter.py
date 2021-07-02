import abc
import os

from cloudharness import log as logger
from flask import render_template
from workspaces.config import Config
from workspaces.service.auth import get_auth_client


class NotificationBaseAdapter(metaclass=abc.ABCMeta):
    def __init__(self, notification, channel, backend):
        """
        Init a notification

        Args:
            notification: the notification object from the values.yaml
            channel: the channel object from the values.yaml

        Returns:
            new Notification object
        """
        self.notification = notification
        self.channel = channel
        self.backend = backend
        self.user = self._get_user()
        self.template = os.path.join(
            self.channel["templateFolder"],
            self.notification["template"]
        )

    @abc.abstractmethod
    def notify(self, context):
        """
        Trigger a notification for the notification and channel

        Args:
            context: the context passed to the template of the notification object
        """
        raise NotImplementedError

    def render_content(self, context):
        context.update({"subject": self.subject})
        context.update({"user": self.user})
        return render_template(
            os.path.join(
                "notifications",
                self.template),
            **context)

    def _get_user(self):

        try:
            return get_auth_client().get_current_user()
        except Exception as e:
            logger.error("Auth client error", exc_info=True)
            return None
