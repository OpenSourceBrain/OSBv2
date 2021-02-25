import mimetypes
import os

from pathlib import Path
from flask import current_app
from ..config import Config
from ..repository.model_repository import WorkspaceRepository, WorkspaceImageRepository, db
from ..repository.models import WorkspaceImage


def _save_image(id_=None, image=None, filename_base=None):
    ext = mimetypes.guess_extension(image.mimetype)
    folder = os.path.join(Config.WORKSPACES_DIR, f"{id_}")
    Path(os.path.join(Config.STATIC_DIR, folder)).mkdir(
        parents=True, exist_ok=True)

    if filename_base is None:
        filename = image.filename
    else:
        filename = f"{filename_base}{ext}"
    filename = os.path.join(folder, filename)
    image.save(os.path.join(Config.STATIC_DIR, filename))
    return filename


def setthumbnail(id_=None, thumbNail=None, body=None, **kwargs):
    workspace, found = WorkspaceRepository().get(id=id_)
    if not found:
        return f"Workspace with id {id_} not found.", 404
    if not thumbNail:
        return f"Thumbnail is not specified.", 404
    # ext = mimetypes.guess_extension(thumbNail.mimetype)
    # folder = os.path.join(Config.WORKSPACES_DIR, f"{id}")
    # Path(os.path.join(Config.STATIC_DIR,folder)).mkdir(parents=True, exist_ok=True)

    # filename = f"{folder}/thumbnail{ext}"
    # thumbNail.save(os.path.join(Config.STATIC_DIR,filename))
    saved_filename = _save_image(
        id=id_, image=thumbNail, filename_base="thumbnail")
    workspace.thumbnail = saved_filename
    db.session.add(workspace)
    db.session.commit()
    return "Saved", 200


def addimage(id_=None, image=None, body=None, **kwargs):
    workspace, found = WorkspaceRepository().get(id=id_)
    if not found:
        return f"Workspace with id {id_} not found.", 404
    if not image:
        return f"Workspace Image is not specified.", 404

    # ext = mimetypes.guess_extension(image.mimetype)
    # folder = os.path.join(Config.WORKSPACES_DIR, f"{id}")
    # Path(os.path.join(Config.STATIC_DIR,folder)).mkdir(parents=True, exist_ok=True)

    # image.save(os.path.join(Config.STATIC_DIR, image.filename))

    saved_filename = _save_image(id=id_, image=image)
    workspace.gallery.append(WorkspaceImage(image=saved_filename))
    db.session.add(workspace)
    db.session.commit()
    return "Saved", 200


def delimage(id_=None, image_id=None, **kwargs):
    workspace, found = WorkspaceRepository().get(id=id_)
    if not found:
        return f"Workspace with id {id_} not found.", 404
    if not image_id:
        return f"Image Id is not specified.", 404

    wsir = WorkspaceImageRepository()
    wsi, found = wsir.get(id=image_id)
    if not found:
        return f"Workspace Image with id {image_id} not found.", 404

    if wsi.workspace_id != id_:
        return f"Workspace Image Id {image_id} doesn't belong to Workspace {id_}.", 404

    result = wsir.delete(id=image_id)
    try:
        filename = os.path.join(Config.STATIC_DIR, wsi.image)
        os.remove(filename)
    except Exception as e:
        current_app.logger.info(
            f"Failed removing image {wsi.image} from filesystem.")
    return result
