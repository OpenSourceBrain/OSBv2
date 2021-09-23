import * as React from "react";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import NestedMenuItem from "material-ui-nested-menu-item";
import { IconButton } from "@material-ui/core";
import * as Icons from "../icons";

import { OSBApplications, Workspace } from "../../types/workspace";
import OSBDialog from "../common/OSBDialog";
import { WorkspaceEditor } from "./../index";
import { canEditWorkspace } from '../../service/UserService';
import { UserInfo } from "../../types/user";


interface WorkspaceActionsMenuProps {
  workspace: Workspace;
  updateWorkspace?: (ws: Workspace) => null;
  deleteWorkspace?: (wsId: number) => null;
  refreshWorkspaces?: () => null;
  user?: UserInfo;
}


export default (props: WorkspaceActionsMenuProps) => {
  const [editWorkspaceOpen, setEditWorkspaceOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const canEdit = canEditWorkspace(props.user, props.workspace);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleCloseMenu = () => {
    setAnchorEl(null);
  }

  const handleEditWorkspace = () => {
    setEditWorkspaceOpen(true);
    handleCloseMenu();
  }

  const handleDeleteWorkspace = () => {
    props.deleteWorkspace(props.workspace.id);
    handleCloseMenu();
  }

  const handlePublicWorkspace = () => {
    props.updateWorkspace({ ...props.workspace, publicable: true });
    handleCloseMenu();
  }

  const handlePrivateWorkspace = () => {
    props.updateWorkspace({ ...props.workspace, publicable: false });
    handleCloseMenu();
  }

  const handleFeaturedWorkspace = () => {
    props.updateWorkspace({ ...props.workspace, featured: !props.workspace.featured });
    handleCloseMenu();
  }

  const handleOpenWorkspace = () => {
    window.location.href = `/workspace/${props.workspace.id}`;
  }

  const handleCloseEditWorkspace = () => {
    setEditWorkspaceOpen(false);
    props.refreshWorkspaces();
  }

  /*
  *
  * @param applicatonType OSBApplication key
  */
  const handleOpenWorkspaceWithApp = (applicatonType: string) => {
    window.location.href = `/workspace/${props.workspace.id}/${applicatonType}`;
  }

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <Icons.Dots style={{ fontSize: "1rem" }} />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted={true}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {canEdit && <MenuItem onClick={handleEditWorkspace}>Edit</MenuItem>}
        {canEdit && <MenuItem onClick={handleDeleteWorkspace}>Delete</MenuItem>}
        {canEdit && !props.workspace.publicable && <MenuItem onClick={handlePublicWorkspace}>Make public</MenuItem>}
        {canEdit && props.workspace.publicable && <MenuItem onClick={handlePrivateWorkspace}>Make private</MenuItem>}
        {props.user && props.user.isAdmin && props.workspace.publicable && !props.workspace.featured && <MenuItem onClick={handleFeaturedWorkspace}>Add to featured</MenuItem>}
        {props.user && props.user.isAdmin && props.workspace.featured && <MenuItem onClick={handleFeaturedWorkspace}>Remove from featured</MenuItem>}
        <MenuItem onClick={handleOpenWorkspace}>Open workspace</MenuItem>
        <NestedMenuItem
          label="Open with..."
          parentMenuOpen={true}

        >
          {
            Object.keys(OSBApplications).map(item =>
              <MenuItem
                key={item}
                onClick={
                  (e) => {
                    handleOpenWorkspaceWithApp(item);
                  }
                }
              >
                {OSBApplications[item].name}
              </MenuItem>
            )
          }


        </NestedMenuItem>
      </Menu>
      <OSBDialog
        title={"Edit workspace " + props.workspace.name}
        open={editWorkspaceOpen}
        closeAction={handleCloseEditWorkspace}
        maxWidth="lg"
      >
        <WorkspaceEditor workspace={props.workspace} onLoadWorkspace={handleCloseEditWorkspace} />
      </OSBDialog>
    </>
  )
}