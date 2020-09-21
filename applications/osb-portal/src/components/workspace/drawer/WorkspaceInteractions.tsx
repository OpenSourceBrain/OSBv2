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

import WorkspaceResourceBrowser from "./WorkspaceResourceBrowser";
import VolumePathBrowser from "./VolumePathBrowser";
import { ShareIcon } from "../../icons";
import { Workspace } from "../../../types/workspace";
import OSBDialog from "../../common/OSBDialog";
import AddResourceForm from "../AddResourceForm";

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
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  svgIcon: {},
  loading: {
    color: theme.palette.grey[600],
  },
  flexCenter: {
    display: "flex",
    alignItems: "center",
  },
  closedText: {
    writingMode: "vertical-lr",
    textOrientation: "mixed",
    transform: "rotate(-180deg)",
    margin: "auto",
    display: 'flex',
    alignItems: 'center'
  },
  rotate180: {
    transform: "rotate(-180deg)",
  },
  treePadding: {
    paddingLeft: 48
  }
}));

interface WorkspaceProps {
  workspace: Workspace;
  open?: boolean;
}

const TitleWithShareIcon = (props: any) => {
  const classes = useStyles();
  return (
    <>
     
      <Typography variant="h5" className={classes.flexCenter}>{props.name}</Typography>
      <IconButton>
        <ShareIcon />
      </IconButton>
    </>
  );
};



export default (props: WorkspaceProps) => {
  const classes = useStyles();
  const [addResourceOpen, setAddResourceOpen] = React.useState(false);
  const closeAskLogin = () => setAddResourceOpen(false);

  const showAddResource = () => {
    setAddResourceOpen(true);
  }

  const handleResourceAdded = () => {
    setAddResourceOpen(false);
  }

  const [expanded, setExpanded] = React.useState<string | false>('workspace');

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };


  return (<>
    <OSBDialog
      title={"Add resource to Workspace " + props.workspace.name}
      open={addResourceOpen}
      closeAction={() => setAddResourceOpen(false)}
    >
        <AddResourceForm workspace={props.workspace} onResourceAdded={handleResourceAdded} />
    </OSBDialog>
    {props.open ? (
      <>
        <ExpansionPanel elevation={0} expanded={expanded === 'workspace'} onChange={handleChange('workspace')}>
          <ExpansionPanelSummary
            expandIcon={<ArrowUpIcon style={{padding: 0}} />}
          >
            <TitleWithShareIcon name={props.workspace.name} />
          </ExpansionPanelSummary>

          <ExpansionPanelDetails>
            <Divider />
            <ListItem button={true} onClick={showAddResource} className={classes.treePadding}>
              <ListItemIcon style={{paddingLeft: 0}}>
                <AddIcon style={{ fontSize: "1.3rem" }} />
              </ListItemIcon>
              <ListItemText primary={"Add resource"} />
            </ListItem>
            <Divider />
            <WorkspaceResourceBrowser
              workspace={props.workspace}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel elevation={0}>
          <ExpansionPanelSummary
            expandIcon={<ArrowUpIcon />}
          >
            <TitleWithShareIcon name="User shared space" />
          </ExpansionPanelSummary>

          <ExpansionPanelDetails>
            <VolumePathBrowser
              volumeId={null/* TODO get from logged user */}
              path="/"
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </>) :
      <>
        <div className={classes.closedText}>
          <IconButton onClick={showAddResource}>
            <AddIcon style={{ fontSize: "1.3rem" }} />
          </IconButton>
          {props.workspace.name}

          <IconButton onClick={showAddResource}>
            <ShareIcon
              className={[classes.svgIcon, classes.rotate180].join(" ")}
              style={{ fontSize: "1rem" }}
            />
          </IconButton>
        </div>
      </>
    }
  </>);

};
