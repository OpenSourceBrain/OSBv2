import * as React from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import { useTheme } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";

import { WorkspaceInteractions } from "../..";
import { OSBApplications, ResourceStatus, Workspace, WorkspaceResource } from "../../../types/workspace";

import { ShareIcon, ArrowLeft, ArrowRight } from "../../icons";
import { UserInfo } from "../../../types/user";

import { WorkspaceFrame } from "../../../components";

const useStyles = makeStyles((theme) => ({
  drawerContent: {
    width: 400,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: "nowrap",
    display: "flex",
  },
  drawerOpen: {
    top: "initial",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    top: "initial",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",

    width: "auto",

    "& .verticalFit": {
      display: "block",
    },
  },
  drawerPaper: {
    position: "static",
    flex: 1,
    display: "flex",
    bottom: 0,
    paddingTop: theme.spacing(1),
    justifyContent: "space-between",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    fontSize: "1rem",
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  closedTextBottom: {
    writingMode: "vertical-lr",
    textOrientation: "mixed",
    transform: "rotate(-180deg)",
    margin: "auto",
    position: "relative",
    bottom: 0,
    height: "70vh",
  },
  loading: {
    color: theme.palette.grey[600],
  },
}));

interface WorkspaceDrawerProps {
  workspace: Workspace;
  user: UserInfo;
  refreshWorkspace: () => any;
}

export const WorkspaceDrawer: React.FunctionComponent<WorkspaceDrawerProps> = ({
  user,
  children,
  workspace,
}) => {
  if (!workspace) {
    return <></>;
  }
  const classes = useStyles();

  const { app } = useParams<{ app: string }>();
  // Keep drawer closed for jupyter by default
  const [open, setOpen] = React.useState(app === "jupyter" ? false : true);

  const getActiveResource = () => {
    if (workspace.lastOpen != null) {
      if (!app || workspace.lastOpen.type.application === OSBApplications[app]) {
        return workspace.lastOpen;
      } 
    }
   if (app) {
      return workspace.resources.find(
        (resource) =>
          resource.type.application === OSBApplications[app] &&
          resource.status === ResourceStatus.available
      );
    } else if (workspace.resources?.length) {
      return workspace.resources.find(resource => resource.status === ResourceStatus.available);
    }
  };
  const [currentResource, setCurrentResource] =
    React.useState<WorkspaceResource>(getActiveResource());

  const handleToggleDrawer = () => setOpen(!open);

  return user &&
  workspace && (
    <Box
      display="flex"
      alignItems="stretch"
      flex="1"
      className="verticalFill"
    >
      <Drawer
        variant="permanent"
        anchor="left"
        elevation={0}
        open={open}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={`${open ? classes.drawerContent : ""} verticalFit`}>
          <WorkspaceInteractions
            workspace={workspace}
            open={open}
            currentResource={currentResource}
            openResource={setCurrentResource}
          />
        </div>
        <div>
          <Divider />
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleToggleDrawer} size="large">
              {open ? (
                <ArrowLeft style={{ fontSize: "1rem" }} />
              ) : (
                <ArrowRight style={{ fontSize: "1rem" }} />
              )}
            </IconButton>
          </div>
        </div>
      </Drawer>

      <Box display="flex" flex="1">
        <WorkspaceFrame currentResource={currentResource} />
        {children}
      </Box>
    </Box>
  );
};
