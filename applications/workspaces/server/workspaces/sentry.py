"""
Sentry initialization for the workspaces backend.

The Sentry configuration is read from the application's ``values.yaml`` (the
top-level ``sentry:`` block, exposed through the Cloud Harness config in
``allvalues.yaml``) instead of fetching the DSN at runtime from the common
service. Sentry is only wired up when the app's ``harness.sentry`` flag is
enabled — it is ``false`` for local and dev deployments, so this is a no-op
there.
"""
import logging
import os

from cloudharness.applications import get_current_configuration
from cloudharness.utils.config import CloudharnessConfig

logger = logging.getLogger(__name__)


def _get_sentry_config(app_name):
    """Return the raw ``sentry:`` block for the app, or ``None`` if absent."""
    try:
        apps = CloudharnessConfig.get_configuration().get("apps", {})
        return (apps.get(app_name) or {}).get("sentry")
    except Exception:
        logger.warning("Could not read Sentry configuration from values", exc_info=True)
        return None


def init_sentry(app_name):
    """Initialize Sentry for the backend from the app's values.yaml config."""
    try:
        if not get_current_configuration().is_sentry_enabled():
            logger.info("Sentry is disabled for %s", app_name)
            return
    except Exception:
        logger.warning("Could not determine whether Sentry is enabled; skipping", exc_info=True)
        return

    sentry_config = _get_sentry_config(app_name)
    if not sentry_config:
        logger.warning("Sentry is enabled but no `sentry:` config was found for %s", app_name)
        return

    dsn = sentry_config.get("dsn")
    if not dsn:
        logger.warning("Sentry is enabled but no DSN is configured for %s", app_name)
        return

    import sentry_sdk
    from sentry_sdk.integrations.flask import FlaskIntegration

    environment = os.environ.get("DOMAIN", "production")

    sentry_sdk.init(
        dsn=dsn,
        environment=environment,
        integrations=[FlaskIntegration()],
        sample_rate=float(sentry_config.get("sample_rate", 1.0) or 1.0),
    )
    logger.info("Sentry initialized for %s (environment=%s)", app_name, environment)
