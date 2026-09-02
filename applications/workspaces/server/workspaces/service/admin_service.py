from sqlalchemy import func

from workspaces.database import db
from workspaces.persistence.models import OSBRepositoryEntity, WorkspaceEntity


def get_user_resource_counts() -> dict:
    """Per-user totals of workspaces and repositories, keyed by keycloak user id.

    Counts include private resources, so callers must be admins (enforced in
    the controller). Users without any resources have no entry.
    """
    counts = {}
    for entity, key in ((WorkspaceEntity, "workspaces"), (OSBRepositoryEntity, "repositories")):
        rows = db.session.query(entity.user_id, func.count(entity.id)).group_by(entity.user_id)
        for user_id, num in rows:
            if user_id:
                counts.setdefault(user_id, {"workspaces": 0, "repositories": 0})[key] = num
    return counts
