import * as React from "react";
import { useNavigate } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NestedMenuItem from "../common/NestedMenuItems";
import Button from "@mui/material/Button";
import { IconButton, Link } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";

import { OSBApplications, Workspace } from "../../types/workspace";
import { WorkspaceEditor } from "../index";
import { canEditWorkspace } from "../../service/UserService";
import { UserInfo } from "../../types/user";
import WorkspaceService from "../../service/WorkspaceService";
import OSBLoader from "../common/OSBLoader";
import { bgDarkest, textColor, lightWhite } from "../../theme";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import * as Icons from "../icons";
import PrimaryDialog from "../dialogs/PrimaryDialog";
import { RootState } from "../../store/rootReducer";


interface WorkspaceActionsMenuProps {
  workspace?: Workspace;
  updateWorkspace?: (ws: Workspace) => void;
  deleteWorkspace?: (wsId: number) => void;
  refreshWorkspaces?: () => void;
  user?: UserInfo;
  isWorkspaceOpen?: boolean;
  ButtonComponent?: React.ComponentType<any>;
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
  const {ButtonComponent} = props;

  const [editWorkspaceOpen, setEditWorkspaceOpen] = React.useState(false);
  const [cloneInProgress, setCloneInProgress] = React.useState<boolean>(false);
  const [cloneComplete, setCloneComplete] = React.useState<boolean>(false);
  const [clonedWSId, setClonedWSId] = React.useState<number>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const canEdit = canEditWorkspace(props?.user, props?.workspace);
  const navigate = useNavigate();
  const [showDeleteWorkspaceDialog, setShowDeleteWorkspaceDialog] = React.useState(false);
  const [showFailCloneDialog, setShowFailCloneDialog] = React.useState<{open: boolean, message: any}>({
    open: false,
    message: "",
  });

  const user = useSelector((state: RootState) => state.user);

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

    if (window.location.pathname !== "/") {
      navigate('/')
    }
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
    navigate(`/workspaces/${props.workspace.id}`);
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
      (e) => {
        setCloneInProgress(false);
        if (e.status === 405) {
          setShowFailCloneDialog({ open: true, message: <>
            Workspaces quota exceeded. Try to delete some workspace before retry. 
            To see and manage your quotas, go to your 
            <Link href={`/user/${user.username}`} onClick={() => navigate(`/user/${user.username}`)}>account page.</Link>
            </> });
        } else {
          setShowFailCloneDialog({ open: true, message: "Unexpected error cloning the workspace. Please try again later." });
        }
      }
    )
  };

  const handleOpenClonedWorkspace = () => {
    navigate(`/workspaces/${clonedWSId}`);
  };

  const navigateToAccountsPage = () => {
    navigate(`/user/${user.username}`);
  }

  /*
   *
   * @param applicatonType OSBApplication key
   */
  const handleOpenWorkspaceWithApp = (applicatonType: string) => {
    navigate(`/workspaces/open/${props.workspace.id}/${applicatonType}`);
  };

  return (
    <>
    {ButtonComponent ? <ButtonComponent className="btn-actions" onClick={handleClick} /> :
      <IconButton className="btn-actions" size="small" onClick={handleClick}>
        <Icons.Dots style={{ fontSize: "1rem" }} />
      </IconButton>}
      <Menu
        id="workspace-actions-menu"
        anchorEl={anchorEl}
        keepMounted={true}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
       {!props.isWorkspaceOpen && (
          <MenuItem className="open-workspace" onClick={handleOpenWorkspace}>
            Open workspace
          </MenuItem>
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
        {props.user && (
          <MenuItem onClick={handleCloneWorkspace}>Clone workspace</MenuItem>
        )}
        {canEdit && (
          <MenuItem className="edit-workspace" onClick={handleEditWorkspace}>
            Edit
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
          
        {canEdit && (
          <MenuItem
            className="delete-workspace"
            onClick={() => {
              setShowDeleteWorkspaceDialog(true);
              setAnchorEl(null);
            }}
          >
            Delete
          </MenuItem>
        )}
       
       
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
      <>
        {
          showDeleteWorkspaceDialog && (
            <PrimaryDialog
              open={showDeleteWorkspaceDialog}
              setOpen={setShowDeleteWorkspaceDialog}
              handleCallback={handleDeleteWorkspace}
              actionButtonText={'DELETE'}
              cancelButtonText={'CANCEL'}  
              title={'Delete Workspace "' + props.workspace.name + '"'}
              description={'You are about to delete Workspace "' + props.workspace.name + '". This action cannot be undone. Are you sure?'}
            />
          )
        }
      </>
      {
        showFailCloneDialog && (
          <PrimaryDialog
            open={showFailCloneDialog.open}
            setOpen={() => setShowFailCloneDialog({ open: !showFailCloneDialog.open, message: "" })}
            handleCallback={navigateToAccountsPage}
            actionButtonText={'Go to Account Page'}
            cancelButtonText={'Close'}
            title="Failed to clone workspace"
            description={showFailCloneDialog.message}
          />
        )
      }
    </>
  );
};
