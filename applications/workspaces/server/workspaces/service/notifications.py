from cloudharness.utils.config import CloudharnessConfig as conf
from workspaces.service.notification.adapters import NotificationEmailAdapter

DOMAIN = conf.get_configuration()["domain"]
WORKSPACES_APP_CONFIG = conf.get_application_by_filter(name="workspaces")[0]
CHANNELS = WORKSPACES_APP_CONFIG["notification"]["channels"]


def notify(trigger, context):
    notification = WORKSPACES_APP_CONFIG["notification"]["triggers"][trigger]

    for c in notification["channels"]:
        channel = CHANNELS[c]
        if channel["type"].lower() == "email":
            return NotificationEmailAdapter(notification, channel).notify(context=context)
        else:
            raise NotImplementedError
