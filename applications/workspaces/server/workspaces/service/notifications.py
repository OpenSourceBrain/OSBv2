from cloudharness import log as logger
from cloudharness.utils.config import CloudharnessConfig as conf
from workspaces.service.notification.adapters import NotificationEmailAdapter
from workspaces.service.notification.backends import NotificationEmailBackend, NotificationConsoleBackend

DOMAIN = conf.get_configuration()["domain"]
WORKSPACES_APP_CONFIG = conf.get_application_by_filter(name="workspaces")[0]
CHANNELS = WORKSPACES_APP_CONFIG["notification"]["channels"]
BACKENDS = WORKSPACES_APP_CONFIG["notification"]["backends"]


def notify(trigger, context):
    notification = WORKSPACES_APP_CONFIG["notification"]["triggers"][trigger]

    for c in notification["channels"]:
        channel = CHANNELS[c]
        for b in channel["backends"]:
            backend = BACKENDS[b]
            if   backend["type"] == "email":
                channel_backend = NotificationEmailBackend
            elif backend["type"] == "console":
                channel_backend = NotificationConsoleBackend

            try:
                if channel["type"].lower() == "email":
                    NotificationEmailAdapter(
                        notification=notification,
                        channel=channel,
                        backend=channel_backend).notify(context=context)
                else:
                    raise NotImplementedError
            except Exception as e:
                logger.error('Sending notification error.', exc_info=True)
