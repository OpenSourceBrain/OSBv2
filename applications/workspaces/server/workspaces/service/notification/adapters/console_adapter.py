import smtplib

from cloudharness import log as logger
from cloudharness.utils.config import CloudharnessConfig as conf
from .base_adapter import NotificationBaseAdapter


DOMAIN = conf.get_configuration()["domain"]


class NotificationConsoleAdapter(NotificationBaseAdapter):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.subject = self.notification["subject"].replace("{{domain}}", DOMAIN)

    def notify(self, context):
        content = self.render_content(context)
        logger.info(f"New notification, subject: {self.subject}\n{content}")
