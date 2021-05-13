from workspaces.service.events import test_kafka_running


def live():  # noqa: E501
    """Test if application is healthy
     # noqa: E501
    :rtype: str
    """

    return "I'm alive!"



def ready():  # noqa: E501
    """Test if application is healthy
     # noqa: E501
    :rtype: str
    """
    if test_kafka_running():
        return "I'm ready!"
    else:
        raise Exception("Readiness check failed")
