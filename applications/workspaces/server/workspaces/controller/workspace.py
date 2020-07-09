import mimetypes
import os

from pathlib import Path
from flask import current_app
from ..config import Config
from ..repository.model_repository import WorkspaceRepository, db
from ..repository.models import WorkspaceHasType, WorkspaceImage

def addtype(id=None, body=None, **kwargs):
    workspace, found = WorkspaceRepository().get(id=id)
    if not found:
        return f"Workspace with id {id} not found.", 404

    workspace_type = body.get('workspaceType', None)
    if not workspace_type:
        return f"Workspace type not specified.", 404

    try:
        next(filter(lambda x: x.type == workspace_type,  workspace.types))
    except StopIteration:
        # workspace type not in workspaces.types --> insert one
        workspace.types.append(WorkspaceHasType(type=workspace_type))

    workspace.last_type = workspace_type
    db.session.add(workspace)
    db.session.commit()
    return "Saved", 200

def _save_image(id=None, image=None, filename_base=None):
    ext = mimetypes.guess_extension(image.mimetype)
    folder = os.path.join(Config.WORKSPACES_DIR, f"{id}")
    Path(os.path.join(Config.STATIC_DIR,folder)).mkdir(parents=True, exist_ok=True)

    if filename_base is None:
        filename = image.filename
    else:
        filename = f"{filename_base}{ext}"
    filename = os.path.join(folder, filename)
    image.save(os.path.join(Config.STATIC_DIR,filename))
    return filename

def setthumbnail(id=None, thumbNail=None, body=None, **kwargs):
    workspace, found = WorkspaceRepository().get(id=id)
    if not found:
        return f"Workspace with id {id} not found.", 404
    if not thumbNail:
        return f"Thumbnail is not specified.", 404
    # ext = mimetypes.guess_extension(thumbNail.mimetype)
    # folder = os.path.join(Config.WORKSPACES_DIR, f"{id}")
    # Path(os.path.join(Config.STATIC_DIR,folder)).mkdir(parents=True, exist_ok=True)

    # filename = f"{folder}/thumbnail{ext}"
    # thumbNail.save(os.path.join(Config.STATIC_DIR,filename))
    saved_filename = _save_image(id=id, image=thumbNail, filename_base="thumbnail")
    workspace.thumbnail = saved_filename
    db.session.add(workspace)
    db.session.commit()   
    return "Saved", 200

def addimage(id=None, image=None, body=None, **kwargs):
    workspace, found = WorkspaceRepository().get(id=id)
    if not found:
        return f"Workspace with id {id} not found.", 404
    if not image:
        return f"Image is not specified.", 404

    # ext = mimetypes.guess_extension(image.mimetype)
    # folder = os.path.join(Config.WORKSPACES_DIR, f"{id}")
    # Path(os.path.join(Config.STATIC_DIR,folder)).mkdir(parents=True, exist_ok=True)

    # image.save(os.path.join(Config.STATIC_DIR, image.filename))

    saved_filename = _save_image(id=id, image=image)
    workspace.gallery.append(WorkspaceImage(image = saved_filename))
    db.session.add(workspace)
    db.session.commit()   
    return "Saved", 200