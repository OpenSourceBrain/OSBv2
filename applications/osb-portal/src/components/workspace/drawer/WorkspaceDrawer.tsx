import * as React from "react";
import { useParams } from 'react-router-dom';
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";

import { WorkspaceInteractions } from "../..";
import { Workspace, WorkspaceResource } from "../../../types/workspace";

import { ShareIcon, ArrowLeft, ArrowRight } from "../../icons";
import { UserInfo } from "../../../types/user";

import {
  WorkspaceFrame
} from "../../../components";


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
      display: 'block',
    }
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

export const WorkspaceDrawer: React.FunctionComponent<WorkspaceDrawerProps> = ({ user, children, workspace }) => {
  if (!workspace) {
    return <></>;
  }
  const classes = useStyles();

  const { app } = useParams<{ app: string }>();
  // Keep drawer closed for jupyter by default
  const [open, setOpen] = React.useState(app === "jupyter" ? false : true);

  const [currentResource, setCurrentResource] = React.useState<WorkspaceResource>(!app ? workspace.lastOpen : null);

  const handleToggleDrawer = () => setOpen(!open);


  return user && workspace && (
    <Box display="flex" alignItems="stretch" flex="1" className="verticalFill">
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
        <div className={`${open ? classes.drawerContent : ''} verticalFit`}>
          <WorkspaceInteractions workspace={workspace} open={open} openResource={setCurrentResource} />
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

      <Box display="flex" flex="1">
        <WorkspaceFrame currentResource={currentResource} />
        {children}
      </Box>
    </Box>
  );
};
