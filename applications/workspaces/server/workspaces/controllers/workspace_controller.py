import mimetypes
import os
from pathlib import Path

from cloudharness import log as logger

from workspaces.config import Config
from workspaces.models.resource_origin import ResourceOrigin
from workspaces.models.resource_status import ResourceStatus
from workspaces.persistence.crud_persistence import WorkspaceImageRepository, WorkspaceRepository, db
from workspaces.persistence.models import TWorkspaceEntity, WorkspaceEntity, WorkspaceImage
from workspaces.helpers.etl_helpers import copy_origins
from workspaces.service.crud_service import NotAuthorized, NotAllowed, WorkspaceService

def _save_image(id_=None, image=None, filename_base=None, dirname=None):
    ext = mimetypes.guess_extension(image.mimetype)
    folder = os.path.join(dirname, f"{id_}")
    Path(os.path.join(Config.STATIC_DIR, folder)).mkdir(parents=True, exist_ok=True)

    if filename_base is None:
        filename = image.filename
    else:
        filename = f"{filename_base}{ext}"
    filename = os.path.join(folder, filename)
    image.save(os.path.join(Config.STATIC_DIR, filename))
    return filename


def setthumbnail(id_=None, thumb_nail=None, body=None, **kwargs):
    workspace = WorkspaceRepository().get(id=id_)
    if workspace is None:
        return f"Workspace with id {id_} not found.", 404
    if not thumb_nail:
        return f"Thumbnail is not specified.", 404
    # ext = mimetypes.guess_extension(thumbNail.mimetype)
    # folder = os.path.join(Config.WORKSPACES_DIR, f"{id}")
    # Path(os.path.join(Config.STATIC_DIR,folder)).mkdir(parents=True, exist_ok=True)

    # filename = f"{folder}/thumbnail{ext}"
    # thumbNail.save(os.path.join(Config.STATIC_DIR,filename))
    saved_filename = _save_image(id_=id_, image=thumb_nail, filename_base="thumbnail", dirname=Config.WORKSPACES_DIR)
    workspace.thumbnail = saved_filename
    db.session.add(workspace)
    db.session.commit()
    return "Saved", 200


def addimage(id_=None, image=None, body=None, **kwargs):
    workspace = WorkspaceRepository().get(id=id_)
    if workspace is None:
        return f"Workspace with id {id_} not found.", 404
    if not image:
        return f"Workspace Image is not specified.", 400

    # ext = mimetypes.guess_extension(image.mimetype)
    # folder = os.path.join(Config.WORKSPACES_DIR, f"{id}")
    # Path(os.path.join(Config.STATIC_DIR,folder)).mkdir(parents=True, exist_ok=True)

    # image.save(os.path.join(Config.STATIC_DIR, image.filename))

    saved_filename = _save_image(id=id_, image=image, dirname=Config.WORKSPACES_DIR)
    workspace.gallery.append(WorkspaceImage(image=saved_filename))
    db.session.add(workspace)
    db.session.commit()
    return "Saved", 200


def delimage(id_=None, image_id=None, **kwargs):
    workspace = WorkspaceRepository().get(id=id_)
    if workspace is None:
        return f"Workspace with id {id_} not found.", 404
    if not image_id:
        return f"Image Id is not specified.", 400

    wsir = WorkspaceImageRepository()
    wsi = wsir.get(id=image_id)
    if wsi is None:
        return f"Workspace Image with id {image_id} not found.", 404

    if wsi.workspace_id != id_:
        return f"Workspace Image Id {image_id} doesn't belong to Workspace {id_}.", 400

    result = wsir.delete(id=image_id)
    try:
        filename = os.path.join(Config.STATIC_DIR, wsi.image)
        os.remove(filename)
    except Exception as e:
        logger.info(f"Failed removing image {wsi.image} from filesystem.")
    return result


def import_resources(id_, body, **kwargs):
    workspace: TWorkspaceEntity = WorkspaceRepository().get(id=id_)
    if workspace is None:
        return f"Workspace with id {id_} not found.", 404

    resource_origins = [ResourceOrigin.from_dict(r) for r in body.get("resourceorigins", [])]
    copy_origins(id_, resource_origins)
    return "Scheduled", 200

def workspace_clone(id_, body=None):
    workspace = WorkspaceRepository().get(id=id_)
    if workspace is None:
        return f"Workspace with id {id_} not found.", 404
    try:
        ws = WorkspaceService().clone(id_)
        if ws is None:
            return "Workspace not found", 404
        return ws.to_dict()
    except NotAuthorized:
        return "Not authorized", 401
    except NotAllowed:
        return "Not allowed", 405
