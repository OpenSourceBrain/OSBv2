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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem'
import WorkspaceResourceBrowser from "./WorkspaceResourceBrowser";
import VolumePathBrowser from "./VolumePathBrowser";
import { ShareIcon } from "../../icons";
import { ResourceStatus, Workspace } from "../../../types/workspace";
import OSBDialog from "../../common/OSBDialog";
import AddResourceForm from "../AddResourceForm";

const MAX_RESOURCE_WAIT_TIME = 1000 * 60 * 10;

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
    paddingLeft: 43
  }
}));

interface WorkspaceProps {
  workspace: Workspace;
  open?: boolean;
  refreshWorkspace?: () => any;
  updateWorkspace: (ws: Workspace) => null,
  deleteWorkspace: (wsId: number) => null,
  user: any,
  [propName: string]: any;
}




export default (props: WorkspaceProps | any) => {
  const { workspace } = props;
  const classes = useStyles();
  const [addResourceOpen, setAddResourceOpen] = React.useState(false);

  const showAddResource = () => {
    setAddResourceOpen(true);
  }

  const handleResourceAdded = () => {
    setAddResourceOpen(false);
    props.refreshWorkspace();
  }

  if (workspace.resources.find((resource: any) => resource.status === ResourceStatus.pending)) {
    setTimeout(props.refreshWorkspace, 15000);
  }


  const [expanded, setExpanded] = React.useState<string | false>('workspace');

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
    if (!anchorEl) {
      setExpanded(newExpanded ? panel : false);
    }
  };



  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setAnchorEl(null);
  };
  const handlePublicWorkspace = () => {
    props.updateWorkspace({ ...workspace, publicable: true });
    handleShareClose();
  }

  const handlePrivateWorkspace = () => {
    props.updateWorkspace({ ...workspace, publicable: false });
    handleShareClose();
  }



  return (<>
    <OSBDialog
      title={"Add resource to Workspace " + workspace.name}
      open={addResourceOpen}
      closeAction={() => setAddResourceOpen(false)}
    >
      <AddResourceForm workspace={workspace} onResourceAdded={handleResourceAdded} />
    </OSBDialog>
    {props.open ? (
      <>
        <ExpansionPanel elevation={0} expanded={expanded === 'workspace'} onChange={handleChange('workspace')}>
          <ExpansionPanelSummary
            expandIcon={<ArrowUpIcon style={{ padding: 0 }} />}
          >
            <Typography variant="h5" className={classes.flexCenter}>{workspace.name}</Typography>
            <IconButton onMouseDown={handleShareClick}>
              <ShareIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted={true}
              open={Boolean(anchorEl)}
              onClose={handleShareClose}
            >
              {props.user && !workspace.publicable && <MenuItem onClick={handlePublicWorkspace}>Make public</MenuItem>}
              {props.user && workspace.publicable && <MenuItem onClick={handlePrivateWorkspace}>Make private</MenuItem>}
            </Menu>

          </ExpansionPanelSummary>

          <ExpansionPanelDetails>
            <Divider />
            <ListItem button={true} onClick={showAddResource} className={classes.treePadding}>
              <ListItemIcon style={{ paddingLeft: 0 }}>
                <AddIcon style={{ fontSize: "1.3rem" }} />
              </ListItemIcon>
              <ListItemText primary={"Add resource"} />
            </ListItem>
            <Divider />
            <WorkspaceResourceBrowser
              workspace={workspace}
              refreshWorkspace={props.refreshWorkspace}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        { false && // TODO user shared space back when available
          <ExpansionPanel elevation={0}>
            <ExpansionPanelSummary
              expandIcon={<ArrowUpIcon />}
            >
              <Typography variant="h5" className={classes.flexCenter}>User shared space</Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <VolumePathBrowser
                volumeId={null/* TODO get from logged user */}
                path="/"
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        }

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
