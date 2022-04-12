import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import NestedMenuItem from "material-ui-nested-menu-item";
import Button from '@material-ui/core/Button';
import { IconButton } from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import * as Icons from "../icons";
import CloseIcon from '@material-ui/icons/Close';

import { OSBApplications, Workspace } from "../../types/workspace";
import OSBDialog from "../common/OSBDialog";
import { WorkspaceEditor } from "./../index";
import { canEditWorkspace } from '../../service/UserService';
import { UserInfo } from "../../types/user";
import WorkspaceService from "../../service/WorkspaceService"
import OSBLoader from "../common/OSBLoader"
import { bgDarkest, textColor } from "../../theme";

// TODO: refactor to use redux instead of passing props

interface WorkspaceActionsMenuProps {
  workspace: Workspace;
  updateWorkspace?: (ws: Workspace) => null;
  deleteWorkspace?: (wsId: number) => void;
  refreshWorkspaces: () => void;
  user?: UserInfo;
}

const useStyles = makeStyles((theme) => ({
  snackbar: {
    '& .MuiSnackbarContent-root': {
      backgroundColor: bgDarkest,
      color: textColor,
    }
  },
}))


export default (props: WorkspaceActionsMenuProps) => {
  const classes = useStyles();

  const [editWorkspaceOpen, setEditWorkspaceOpen] = React.useState(false);
  const [cloneInProgress, setCloneInProgress] = React.useState<boolean>(false);
  const [cloneComplete, setCloneComplete] = React.useState<boolean>(false);
  const [clonedWSId, setClonedWSId] = React.useState<number>(null);
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
    window.location.href = `/workspace/open/${props.workspace.id}`;
  }

  const handleCloseEditWorkspace = () => {
    setEditWorkspaceOpen(false);
    props.refreshWorkspaces();
  }

  const handleCloneWorkspace = () => {
    handleCloseMenu();
    setCloneInProgress(true);
    WorkspaceService.cloneWorkspace(props.workspace.id).then((res) => {
      props.refreshWorkspaces();
      setCloneInProgress(false);
      setCloneComplete(true);
      setClonedWSId(res.id);
    },
    () => {
      setCloneInProgress(true);
    });
  }

  const handleOpenClonedWorkspace = () => {
    window.location.href = `/workspace/${clonedWSId}`;
  }

  /*
  *
  * @param applicatonType OSBApplication key
  */
  const handleOpenWorkspaceWithApp = (applicatonType: string) => {
    window.location.href = `/workspace/open/${props.workspace.id}/${applicatonType}`;
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
        {props.user && <MenuItem onClick={handleCloneWorkspace}>Clone workspace</MenuItem>}
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
      {editWorkspaceOpen &&
      <WorkspaceEditor
        open={editWorkspaceOpen}
        title={"Edit workspace: " + props.workspace.name}
        closeHandler={handleCloseEditWorkspace}
        workspace={props.workspace} onLoadWorkspace={handleCloseEditWorkspace} />
      }
      <OSBLoader active={cloneInProgress} fullscreen={true} handleClose={handleCloseMenu} messages={["Cloning workspace. Please wait."]} />
      <Snackbar classes={{  root: classes.snackbar }} open={cloneComplete} onClose={() => setCloneComplete(false)} message="Workspace cloned" anchorOrigin={{"vertical": "bottom", "horizontal": "left"}}
        autoHideDuration={5000}
        action={
          <React.Fragment>
            <Button color="primary" size="small" onClick={handleOpenClonedWorkspace}>
              Open
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => setCloneComplete(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        } />
    </>
  )
}
