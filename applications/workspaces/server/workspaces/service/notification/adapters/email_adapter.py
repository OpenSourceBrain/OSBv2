import smtplib

from cloudharness import log as logger
from cloudharness.utils.config import CloudharnessConfig as conf
from cloudharness.utils.secrets import get_secret, SecretNotFound
from email.message import EmailMessage
from .base_adapter import NotificationBaseAdapter


DOMAIN = conf.get_configuration()["domain"]
EMAIL_HOST = conf.get_configuration()["smtp"]["host"]
EMAIL_PORT = conf.get_configuration()["smtp"]["port"]
EMAIL_TLS  = conf.get_configuration()["smtp"].get("use_tls")
try:
    EMAIL_USER = get_secret('email-user')
except SecretNotFound:
    EMAIL_USER = ""
try:
    EMAIL_PASS = get_secret('email-password')
except SecretNotFound:
    EMAIL_PASS = ""


class NotificationEmailAdapter(NotificationBaseAdapter):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.subject = self.notification["subject"].replace("{{domain}}", DOMAIN)
        self.email_from = self.channel["from"]
        self.email_to = self.channel["to"]

    def notify(self, context):
        message = self.render_content(context)
        self.backend(
            email_from=self.email_from,
            email_to=self.email_to,
            subject=self.subject,
            message=message).send()
