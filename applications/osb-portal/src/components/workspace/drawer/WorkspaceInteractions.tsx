import * as React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

import ArrowUpIcon from "@material-ui/icons/ArrowDropUp";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

import WorkspaceVolumePathBrowser from "./WorkspaceVolumePathBrowser";

import { ShareIcon } from "../../icons";
import { Workspace } from "../../../types/workspace";

const useStyles = makeStyles((theme) => ({
  drawerContent: {
    maxWidth: 400,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  expandHeader: {
    display: "flex",
    flexDirection: "row-reverse",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },

  content: {
    flex: 1,
    display: "flex",
  },

  svgIcon: {},
  loading: {
    color: theme.palette.grey[600],
  },
  FlexDisplay: {
    display: "flex",
  },
  headerText: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
}));

interface WorkspaceProps {
  workspace: Workspace;
}

const TitleWithShareIcon = (props: any) => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h5" className={classes.headerText}>{props.name}</Typography>
      <IconButton>
        <ShareIcon />
      </IconButton>
    </>
  );
};

export default (props: WorkspaceProps) => {
  const classes = useStyles();
  return (
    <>
      <ExpansionPanel elevation={0}>
        <ExpansionPanelSummary
          expandIcon={<ArrowUpIcon />}
          className={classes.expandHeader}
        >
          <TitleWithShareIcon name="Workspace XYZ" />
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <Divider />
          <ListItem button={true}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary={"Add resource"} />
          </ListItem>
          <Divider />
          <WorkspaceVolumePathBrowser
            volumeId={props.workspace.volume}
            path="/"
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel elevation={0}>
        <ExpansionPanelSummary
          expandIcon={<ArrowUpIcon />}
          className={classes.expandHeader}
        >
          <TitleWithShareIcon name="User shared space" />
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <WorkspaceVolumePathBrowser
            volumeId={null/* TODO get from logged user */}
            path="/"
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </>
  );
};
