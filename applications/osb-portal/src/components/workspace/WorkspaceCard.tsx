import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { IconButton } from "@material-ui/core";
import NestedMenuItem from "material-ui-nested-menu-item";
import { OSBApplications, Workspace } from "../../types/workspace";
import { formatDate } from "../../utils";
import * as Icons from "../icons";
import { UserInfo } from "../../types/user";
import { canEditWorkspace } from '../../service/UserService';
import WorkspaceEdit from "./WorkspaceEditor";
import OSBDialog from "../common/OSBDialog";

interface Props {
  workspace: Workspace;
  updateWorkspace?: (ws: Workspace) => null,
  deleteWorkspace?: (wsId: number) => null,
  user?: UserInfo,
  refreshWorkspaces?: () => null,
  hideMenu?: boolean,
}

const useStyles = makeStyles((theme) => ({
  card: {
    flex: 1,
    minHeight: `18em`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  icon: {
    fontSize: "1em",
  },
  imageIcon: {
    fontSize: "7em",
  },
  actions: {
    lineHeight: "0",
    justifyContent: "flex-end",
  },
  imageContainer: {
    overflow: "hidden",
    height: "130px",
    margin: "0 0 auto",
  },
  image: {
    height: "100%",
    width: "100%",
    maxWidth: "100%",
    objectFit: "cover",
    minHeight: "130px",
  },
  ellipses: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
    display: "block",
  },
  link: {
    lineHeight: "0",
    display: "inline-block",
    width: "100%",
    textAlign: "center",
  },
}));

export const WorkspaceCard = (props: Props) => {
  const workspace: Workspace = props.workspace;
  const classes = useStyles();
  const openTitle = "Open workspace";
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [editWorkspaceOpen, setEditWorkspaceOpen] = React.useState(false);


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


  const handleDeleteWorkspace = () => {
    props.deleteWorkspace(workspace.id);
    handleCloseMenu();
  }

  const handleEditWorkspace = () => {
    setEditWorkspaceOpen(true);
    handleCloseMenu();
  }

  const handlePublicWorkspace = () => {
    props.updateWorkspace({ ...workspace, publicable: true });
    handleCloseMenu();
  }

  const handlePrivateWorkspace = () => {
    props.updateWorkspace({ ...workspace, publicable: false });
    handleCloseMenu();
  }
  const handleCloseEditWorkspace = () => {
    setEditWorkspaceOpen(false);
    props.refreshWorkspaces();
  }

  /**
   *
   * @param applicatonType OSBApplication key
   */
  const handleOpenWorkspaceWithApp = (applicatonType: string) => {
    window.location.href = `/workspace/${workspace.id}/${applicatonType}`;
  }

  const handleOpenWorkspace = () => {
    window.location.href = `/workspace/${workspace.id}`;
  }


  const defaultResource = workspace.lastOpen || workspace.resources[workspace.resources.length - 1];

  const canEdit = canEditWorkspace(props.user, workspace);


  return (
    <>
      <Card className={classes.card} elevation={0}>
        { !props.hideMenu &&
          <CardActions className={classes.actions}>
            <IconButton size="small" onClick={handleClick}>
              <Icons.Dots className={classes.icon} />
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
              {canEdit && !workspace.publicable && <MenuItem onClick={handlePublicWorkspace}>Make public</MenuItem>}
              {canEdit && workspace.publicable && <MenuItem onClick={handlePrivateWorkspace}>Make private</MenuItem>}
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
        </CardActions>
        }

        <Box
          className={classes.imageContainer}
          justifyContent="center"
          alignItems="center"
          display="flex"
        >
          <Link
            href={`/workspace/${workspace.id}`}
            color="inherit"
            className={classes.link}
          >
            {!workspace.thumbnail ? (
              <FolderIcon className={classes.imageIcon} />
            ) : (
              <img
                src={'proxy/workspaces/' + workspace.thumbnail + "?v=" + workspace.timestampUpdated.getMilliseconds()}
                className={classes.image}
                title={openTitle}
                alt={openTitle}
              />
            )}
          </Link>
        </Box>

        <CardContent>
          <Link
            href={`/workspace/${workspace.id}`}
            color="inherit"
            title={`${workspace.name}`}
          >
            <Typography component="h2" variant="h5" className={classes.ellipses}>
              {workspace.name}
            </Typography>
          </Link>
          <Typography variant="caption" className={classes.ellipses}>
            {defaultResource && defaultResource.type.application.name},{" "}
            {formatDate(workspace.timestampUpdated)}
          </Typography>
        </CardContent>
      </Card >
      <OSBDialog
        title={"Edit workspace " + workspace.name}
        open={editWorkspaceOpen}
        closeAction={handleCloseEditWorkspace}
      >
        <WorkspaceEdit workspace={workspace} onLoadWorkspace={handleCloseEditWorkspace} />
      </OSBDialog>
    </>
  );
};

export default WorkspaceCard;
