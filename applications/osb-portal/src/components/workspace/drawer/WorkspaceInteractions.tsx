import * as React from "react";
import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

import ArrowUpIcon from "@material-ui/icons/ArrowDropUp";
import ReadOnlyIcon from "@material-ui/icons/Lock";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpansionPanel from "@material-ui/core/Accordion";
import ExpansionPanelSummary from "@material-ui/core/AccordionSummary";
import ExpansionPanelDetails from "@material-ui/core/AccordionDetails";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem'
import WorkspaceResourceBrowser from "./WorkspaceResourceBrowser";
import VolumePathBrowser from "./VolumePathBrowser";
import { ShareIcon } from "../../icons";
import { ResourceStatus, Workspace, WorkspaceResource } from "../../../types/workspace";
import OSBDialog from "../../common/OSBDialog";
import AddResourceForm from "../AddResourceForm";
import { canEditWorkspace } from '../../../service/UserService';
import { primaryColor } from "../../../theme";
import WorkspaceActionsMenu from "../WorkspaceActionsMenu";
import { UserInfo } from "../../../types/user";


const useStyles = makeStyles((theme) => ({
  drawerContent: {
    maxWidth: 400,
  },
  expansionPanel: {
    display: 'flex',
    flexDirection: 'column',
    "& .MuiCollapse-container": {
      height: '100%',
      "& .MuiCollapse-wrapper": {
        height: 'inherit',
        "& .MuiCollapse-wrapperInner": {
          height: 'inherit',
          "& div[role=region]": {
            height: 'inherit',
          },
        },
      },
    },
    "& .MuiAccordionSummary-root": {
      "& .MuiAccordionSummary-content": {
        "& .MuiTypography-root": {
          paddingLeft: theme.spacing(1),
        },
      },
    },
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
    alignItems: 'center',
  },
  rotate180: {
    transform: "rotate(-180deg)",
  },
  treePadding: {
    paddingLeft: theme.spacing(2)
  },
  workspaceName: {
    color: primaryColor,
    fontWeight: 700,
  },
  dialogTitle: {
    fontWeight: 'normal',
  },
}));

interface WorkspaceProps {
  workspace: Workspace;
  open?: boolean;
  refreshWorkspace?: () => void;
  updateWorkspace: (ws: Workspace) => null,
  deleteWorkspace: (wsId: number) => null,
  user: UserInfo,
  [propName: string]: any;
  openResource: (r: WorkspaceResource) => any
}




export default (props: WorkspaceProps | any) => {
  const { workspace } = props;
  const classes = useStyles();
  const [addResourceOpen, setAddResourceOpen] = React.useState(false);
  const history = useHistory();
  if(!workspace) {
    return null;
  }
  const canEdit = canEditWorkspace(props.user, workspace);

  const showAddResource = () => {
    setAddResourceOpen(true);
  }

  const setAddResourceClosed = () => {
    setAddResourceOpen(false);
  }

  const handleResourceAdded = () => {
    setAddResourceOpen(false);
    props.refreshWorkspace();
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

  const dialogTitle = (
    <>
      <span className={classes.dialogTitle}>
        Add resources to<span className={classes.workspaceName}> Workspace {workspace.name}</span>
      </span>
    </>
  )

  const deleteWorkspace = (wid: number) => {

    props.deleteWorkspace(wid);
    history.push("/")
  }

  return (<>

    {props.open ? (
      <>
        <ExpansionPanel className={`${classes.expansionPanel} verticalFill`} elevation={0} expanded={expanded === 'workspace' || true} onChange={handleChange('workspace')}>
          <ExpansionPanelSummary
          // expandIcon={<ArrowUpIcon style={{ padding: 0 }} />}
          >
            {
            // TODO: when cloning workspaces has been implemented, update tooltip to tell users they can clone workspace to make modifications */
            }
            <Typography
              variant="h4"
              className={classes.flexCenter}>
              {workspace.name}<Tooltip style={{ marginLeft: '0.3em' }} title="Resources are special files that can be opened with applications supported by Open Source Brain. To see all your files, and upload non-resource files, please open the workspace in the JupyterLab application.">
                <InfoOutlinedIcon fontSize="small"/>
              </Tooltip>
              {!canEdit && <Tooltip style={{ marginLeft: '0.3em' }} title="You do not have permissions to modify this workspace."><ReadOnlyIcon fontSize="small" /></Tooltip>}
            </Typography>

            <Box p={2}>
              <WorkspaceActionsMenu workspace={workspace} user={props.user} updateWorkspace={props.updateWorkspace} deleteWorkspace={deleteWorkspace} refreshWorkspaces={props.refreshWorkspace} />
            </Box>
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

          <ExpansionPanelDetails className="verticalFit">
            <Divider />
            {canEdit && <ListItem button={true} onClick={showAddResource} className={classes.treePadding}>
              <ListItemIcon style={{ paddingLeft: 0 }}>
                <AddIcon style={{ fontSize: "1.3rem" }} />
              </ListItemIcon>
              <ListItemText primary={"Add resource"} />
            </ListItem>}
            <Divider />
            <WorkspaceResourceBrowser
              workspace={workspace}
              refreshWorkspace={props.refreshWorkspace}
              openResource={props.openResource}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        {false && // TODO user shared space back when available
          <ExpansionPanel elevation={0}>
            <ExpansionPanelSummary
              expandIcon={<ArrowUpIcon />}
            >
              <Typography variant="h4" className={classes.flexCenter}>User shared space</Typography>
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
          {canEdit && <IconButton onClick={showAddResource}>
            <AddIcon style={{ fontSize: "1.3rem" }} />
          </IconButton>}
          {props.workspace.name}

          <IconButton>
            <WorkspaceActionsMenu workspace={workspace} user={props.user} updateWorkspace={props.updateWorkspace} deleteWorkspace={props.deleteWorkspace} refreshWorkspaces={props.refreshWorkspace} />
          </IconButton>
        </div>
      </>
    }
    <OSBDialog
      title={dialogTitle}
      open={addResourceOpen}
      closeAction={() => setAddResourceOpen(false)
      }
      maxWidth="md"
    >
      {canEdit && <AddResourceForm workspace={workspace} onResourceAdded={handleResourceAdded} onSubmit={setAddResourceClosed} />}
    </OSBDialog>
  </>);

};
