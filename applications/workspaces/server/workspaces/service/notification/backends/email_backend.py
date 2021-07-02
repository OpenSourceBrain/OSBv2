import smtplib

from cloudharness import log as logger
from cloudharness.utils.config import CloudharnessConfig as conf
from cloudharness.utils.secrets import get_secret, SecretNotFound
from email.message import EmailMessage
from .base_backend import NotificationBaseBackend


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


class NotificationEmailBackend(NotificationBaseBackend):
    def __init__(self, email_from=None, email_to=None, subject=None, message=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.email_from = email_from
        self.email_to = email_to
        self.subject = subject
        self.message = message

    def send(self):
        logger.info(f"Sending notification email to {self.email_to}")
        msg = EmailMessage()
        msg['Subject'] = self.subject
        msg['From'] = self.email_from
        msg['To'] = self.email_to
        msg.set_content(self.message, subtype='html')

        smtp = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        if EMAIL_USER or EMAIL_PASS:
            smtp.login(EMAIL_USER, EMAIL_PASS)
        if EMAIL_TLS:
            smtp.starttls()
        smtp.send_message(msg)
