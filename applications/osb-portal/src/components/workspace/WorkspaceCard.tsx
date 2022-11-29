import * as React from "react";

import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import FolderIcon from "@mui/icons-material/Folder";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { Workspace } from "../../types/workspace";
import { formatDate } from "../../utils";
import { UserInfo } from "../../types/user";
import WorkspaceActionsMenu from "./WorkspaceActionsMenu";
import { bgDarkest, paragraph, textColor } from "../../theme";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface Props {
  workspace: Workspace;
  updateWorkspace?: (ws: Workspace) => any;
  deleteWorkspace?: (wsId: number) => any;
  user?: UserInfo;
  refreshWorkspaces?: () => any;
  hideMenu?: boolean;
  [k: string]: any;
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
    width: "auto",
    alignContent: "center",
    alignItems: "center",
  },
  user: {
    "& *": {
      lineHeight: "1em",
      marginRight: "0.3em",
    },
    marginBottom: "0.4em",
    marginTop: "0.4em",
  },
  captions: {
    display: "flex",
    justifyContent: "space-between",
  },
  link: {
    display: "flex",
    width: "fit-content",
    maxWidth: "100%",
    justifyContent: "center",
  },
  localOfferIcon: {
    color: paragraph,
    fontSize: "1rem",
    alignSelf: "center",
    marginLeft: "5px",
  },
  chip: {
    margin: "0px 2px 0px 2px",
    backgroundColor: "#3c3c3c",
    "& .MuiChip-label": {
      color: textColor,
    },
  },
}));

const TagTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: bgDarkest,
    color: textColor,
  },
  arrow: {
    color: bgDarkest,
  },
}))(Tooltip);

export const WorkspaceCard = (props: Props) => {
  const workspace: Workspace = props.workspace;
  const classes = useStyles();
  const openTitle = "Open workspace";
  const defaultResource =
    workspace.lastOpen || workspace.resources[workspace.resources.length - 1];

  return <>
    <Card className={`${classes.card} workspace-card`} elevation={0}>
      {!props.hideMenu && (
        <CardActions className={classes.actions}>
          <WorkspaceActionsMenu
            user={props.user}
            workspace={workspace}
            updateWorkspace={props.updateWorkspace}
            deleteWorkspace={props.deleteWorkspace}
            refreshWorkspaces={props.refreshWorkspaces}
            isWorkspaceOpen={false}
          />
        </CardActions>
      )}

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
          underline="hover">
          {!workspace.thumbnail ? (
            <FolderIcon className={classes.imageIcon} />
          ) : (
            <img
              src={
                "/proxy/workspaces/" +
                workspace.thumbnail +
                "?v=" +
                workspace.timestampUpdated.getMilliseconds()
              }
              className={classes.image}
              title={openTitle}
              alt={openTitle}
            />
          )}
        </Link>
      </Box>

      <CardContent className="workspace-content">
        <Tooltip title={workspace.name}>
          <Link
            href={`/workspace/${workspace.id}`}
            color="inherit"
            className={`${classes.link} workspace-page-link`}
            underline="hover">
            <Typography
              component="h2"
              variant="h4"
              className={classes.ellipses}
            >
              {workspace.name}
            </Typography>
            {workspace.tags.length > 0 && (
              <TagTooltip
                title={workspace.tags.map((tagObject) => {
                  return (
                    <Chip
                      size="small"
                      label={tagObject.tag}
                      key={tagObject.id}
                      className={classes.chip}
                    />
                  );
                })}
                arrow={true}
                placement="top"
              >
                <LocalOfferIcon
                  fontSize="small"
                  className={classes.localOfferIcon}
                />
              </TagTooltip>
            )}
          </Link>
        </Tooltip>
        <Typography
          variant="caption"
          className={`${classes.user} ${classes.ellipses}`}
        >
          <span>by</span>
          <Link
            color="inherit"
            href={`/user/${workspace.user.id}`}
            target="_blank"
            underline="hover">
            {workspace.user.firstName + " " + workspace.user.lastName}
          </Link>
        </Typography>

        <Typography
          variant="caption"
          className={`${classes.captions} ${classes.ellipses}`}
        >
          <span>{formatDate(workspace.timestampUpdated)}</span>{" "}
          <span>
            {defaultResource && defaultResource.type.application.name}
          </span>
        </Typography>
      </CardContent>
    </Card>
  </>;
};

export default WorkspaceCard;
