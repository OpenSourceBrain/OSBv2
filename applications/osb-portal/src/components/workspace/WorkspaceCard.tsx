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
import MenuItem from '@material-ui/core/MenuItem'

import { Workspace } from "../../types/workspace";
import { formatDate } from "../../utils";
import * as Icons from "../icons";
import { IconButton } from "@material-ui/core";
import workspaceService from "../../service/WorkspaceService";


interface Props {
  workspace: Workspace;
  user: any;
  refreshWorkspaces: () => void
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


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteWorkspace = () => {
    workspaceService.deleteWorkspace(workspace.id)
      .then(props.refreshWorkspaces); // this is refreshing page props
    handleClose();
  }

  const handlePublicWorkspace = () => {
    workspaceService.updateWorkspace({ ...workspace, publicable: true }).then(props.refreshWorkspaces);
    handleClose();
  }

  const handlePrivateWorkspace = () => {
    workspaceService.updateWorkspace({ ...workspace, publicable: false }).then(props.refreshWorkspaces);
    handleClose();
  }

  const handleOpenWorkspace = () => {
    window.location.href = `/workspace/${workspace.id}`;
  }

  const defaultResource = workspace.lastOpen || workspace.resources[0];


  return (
    <Card className={classes.card} elevation={0}>
      <CardActions className={classes.actions}>
        <IconButton size="small" onClick={handleClick}>
          <Icons.Dots className={classes.icon} />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted={true}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {props.user && !workspace.publicable && <MenuItem onClick={handleDeleteWorkspace}>Delete</MenuItem>}
          {props.user && !workspace.publicable && <MenuItem onClick={handlePublicWorkspace}>Make public</MenuItem>}
          {props.user && workspace.publicable && <MenuItem onClick={handlePrivateWorkspace}>Make private</MenuItem>}
          <MenuItem onClick={handleOpenWorkspace}>Open workspace</MenuItem>
        </Menu>
      </CardActions>

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
                src={workspace.thumbnail}
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
          {defaultResource && defaultResource.type?.application?.name},{" "}
          {formatDate(workspace.timestampUpdated)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WorkspaceCard;
