import * as React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";

import { WorkspaceInteractions } from "../..";
import { Workspace } from "../../../types/workspace";

import { ShareIcon, ArrowLeft, ArrowRight } from "../../icons";
import { UserInfo } from "../../../types/user";
import WorkspaceService from "../../../service/WorkspaceService";



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

}

export const WorkspaceDrawer: React.FunctionComponent<WorkspaceDrawerProps> = ({ workspace, user, children }) => {
  if (!workspace) {
    return <></>;
  }
  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const [currentWorkspace, setCurrentWorkspace] = React.useState<Workspace>(workspace);

  const handleToggleDrawer = () => setOpen(!open);

  const refreshWorkspace = () => {
    console.log('Inside refreshWorkspace');
    WorkspaceService.getWorkspace(workspace.id).then((refreshedWorkspace) => {
      console.log('refreshedWorkspace', refreshedWorkspace);
      setCurrentWorkspace(refreshedWorkspace);
    }).then((error) => {
      console.log("Error refreshing the workspace");
    });
  }

  return user && workspace && (
    <Box display="flex" alignItems="stretch" flex="1">
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
        <div className={open ? classes.drawerContent : ''}>
          <WorkspaceInteractions workspace={currentWorkspace} open={open} refreshWorkspace={refreshWorkspace}/>
        </div>
        <div>
          <Divider />
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleToggleDrawer}>
              {open ? (
                <ArrowLeft style={{ fontSize: "1rem" }} />
              ) : (
                <ArrowRight style={{ fontSize: "1rem" }} />
              )}
            </IconButton>
          </div>
        </div>
      </Drawer>

      <Box display="flex" flex="1">{children}</Box>
    </Box>
  );
};
