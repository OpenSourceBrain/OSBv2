import * as React from "react";

import makeStyles from "@mui/styles/makeStyles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NestedMenuItem from "../common/NestedMenuItems";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";

import { OSBApplications, Workspace } from "../../types/workspace";
import { WorkspaceEditor } from "../index";
import { canEditWorkspace } from "../../service/UserService";
import { UserInfo } from "../../types/user";
import WorkspaceService from "../../service/WorkspaceService";
import OSBLoader from "../common/OSBLoader";
import { bgDarkest, textColor, lightWhite } from "../../theme";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import * as Icons from "../icons";


interface WorkspaceActionsMenuProps {
  workspace?: Workspace;
  updateWorkspace?: (ws: Workspace) => void;
  deleteWorkspace?: (wsId: number) => void;
  refreshWorkspaces?: () => void;
  user?: UserInfo;
  isWorkspaceOpen?: boolean;
  showButton?: boolean;
  [other: string]: any;
}

const useStyles = makeStyles((theme) => ({
  snackbar: {
    "& .MuiSnackbarContent-root": {
      backgroundColor: bgDarkest,
      color: textColor,
    },
  },
}));

export default (props: WorkspaceActionsMenuProps) => {
  const classes = useStyles();

  const [editWorkspaceOpen, setEditWorkspaceOpen] = React.useState(false);
  const [cloneInProgress, setCloneInProgress] = React.useState<boolean>(false);
  const [cloneComplete, setCloneComplete] = React.useState<boolean>(false);
  const [clonedWSId, setClonedWSId] = React.useState<number>(null);
  const [anchorEl, setAnchorEl] = props.anchorEl ? [props.anchorEl, props.setAnchorEl]: React.useState<null | HTMLElement>(null);
  const canEdit = canEditWorkspace(props?.user, props?.workspace);


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditWorkspace = () => {
    setEditWorkspaceOpen(true);
    handleCloseMenu();
  };

  const handleDeleteWorkspace = () => {
    props.deleteWorkspace(props.workspace.id);
    handleCloseMenu();
  };

  const handlePublicWorkspace = () => {
    props.updateWorkspace({ ...props.workspace, publicable: true });
    handleCloseMenu();
  };

  const handlePrivateWorkspace = () => {
    props.updateWorkspace({ ...props.workspace, publicable: false });
    handleCloseMenu();
  };

  const handleFeaturedWorkspace = () => {
    props.updateWorkspace({
      ...props.workspace,
      featured: !props.workspace.featured,
    });
    handleCloseMenu();
  };

  const handleOpenWorkspace = () => {
    window.location.href = `/workspace/open/${props.workspace.id}`;
  };

  const handleCloseEditWorkspace = () => {
    setEditWorkspaceOpen(false);
    props.refreshWorkspaces();
  };

  const handleCloneWorkspace = () => {
    handleCloseMenu();
    setCloneInProgress(true);
    WorkspaceService.cloneWorkspace(props.workspace.id).then(
      (res) => {
        props.refreshWorkspaces();
        setCloneInProgress(false);
        setCloneComplete(true);
        setClonedWSId(res.id);
      },
      () => {
        setCloneInProgress(true);
      }
    );
  };

  const handleOpenClonedWorkspace = () => {
    window.location.href = `/workspace/${clonedWSId}`;
  };


  /*
   *
   * @param applicatonType OSBApplication key
   */
  const handleOpenWorkspaceWithApp = (applicatonType: string) => {
    window.location.href = `/workspace/open/${props.workspace.id}/${applicatonType}`;
  };

  return (
    <>
    {props.showButton && <IconButton className="btn-workspace-actions" size="small" onClick={handleClick}>
        <Icons.Dots style={{ fontSize: "1rem" }} />
      </IconButton>}
      <Menu
        id="workspace-actions-menu"
        anchorEl={anchorEl}
        keepMounted={true}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {canEdit && (
          <MenuItem className="edit-workspace" onClick={handleEditWorkspace}>
            Edit
          </MenuItem>
        )}
        {canEdit && (
          <MenuItem
            className="delete-workspace"
            onClick={handleDeleteWorkspace}
          >
            Delete
          </MenuItem>
        )}
        {canEdit && !props.workspace?.publicable && (
          <MenuItem
            className="make-public-workspace"
            onClick={handlePublicWorkspace}
          >
            Make public
          </MenuItem>
        )}
        {canEdit && props.workspace?.publicable && (
          <MenuItem
            className="make-private-workspace"
            onClick={handlePrivateWorkspace}
          >
            Make private
          </MenuItem>
        )}
        {props.user &&
          props.user.isAdmin &&
          props.workspace?.publicable &&
          !props.workspace?.featured && (
            <MenuItem
              className="add-featured-workspace"
              onClick={handleFeaturedWorkspace}
            >
              Add to featured
            </MenuItem>
          )}
        {props.user && props.user.isAdmin && props.workspace?.featured && (
          <MenuItem
            className="remove-featured-workspace"
            onClick={handleFeaturedWorkspace}
          >
            Remove from featured
          </MenuItem>
        )}
        {!props.isWorkspaceOpen && (
          <MenuItem className="open-workspace" onClick={handleOpenWorkspace}>
            Open workspace
          </MenuItem>
        )}
        {props.user && (
          <MenuItem onClick={handleCloneWorkspace}>Clone workspace</MenuItem>
        )}
        <NestedMenuItem
          className="open-with"
          label="Open with..."
          parentMenuOpen={true}
        >
          {Object.keys(OSBApplications).map((appCode) => (
            <MenuItem
              key={appCode}
              className={appCode}
              onClick={(e) => {
                handleOpenWorkspaceWithApp(appCode);
              }}
            >
              {OSBApplications[appCode].name}
            </MenuItem>
          ))}
        </NestedMenuItem>
      </Menu>
      {editWorkspaceOpen && (
        <WorkspaceEditor
          open={editWorkspaceOpen}
          title={"Edit workspace: " + props.workspace.name}
          closeHandler={handleCloseEditWorkspace}
          workspace={props.workspace}
          onLoadWorkspace={handleCloseEditWorkspace}
          user={props.user}
        />
      )}
      <OSBLoader
        active={cloneInProgress}
        fullscreen={true}
        handleClose={handleCloseMenu}
        messages={["Cloning workspace. Please wait."]}
      />
       <Snackbar
        classes={{ root: classes.snackbar }}
        open={cloneComplete}
        onClose={() => setCloneComplete(false)}
        message="Workspace cloned"
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        autoHideDuration={5000}
        action={
          <React.Fragment>
            <Button
              color="primary"
              size="small"
              onClick={handleOpenClonedWorkspace}
            >
              Open
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setCloneComplete(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      /> 
    </>
  );
};
