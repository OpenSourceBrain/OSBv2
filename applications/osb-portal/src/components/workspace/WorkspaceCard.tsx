import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";

import { Workspace } from "../../types/workspace";
import { formatDate } from "../../utils";
import { UserInfo } from "../../types/user";
import WorkspaceActionsMenu from "./WorkspaceActionsMenu";

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
  const defaultResource = workspace.lastOpen || workspace.resources[workspace.resources.length - 1];

  return (
    <>
      <Card className={classes.card} elevation={0}>
        { !props.hideMenu &&
          <CardActions className={classes.actions}>
            <WorkspaceActionsMenu user={props.user} workspace={workspace}
            updateWorkspace={props.updateWorkspace} deleteWorkspace={props.deleteWorkspace} refreshWorkspaces={props.refreshWorkspaces} />
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
                src={'/proxy/workspaces/' + workspace.thumbnail + "?v=" + workspace.timestampUpdated.getMilliseconds()}
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
    </>
  );
};

export default WorkspaceCard;
