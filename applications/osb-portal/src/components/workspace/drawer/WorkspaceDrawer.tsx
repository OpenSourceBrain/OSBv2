import * as React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";

import { WorkspaceInteractions } from "../..";
import {
  OSBApplications,
  ResourceStatus,
  Workspace,
  WorkspaceResource,
} from "../../../types/workspace";

import workspaceResourceService from "../../../service/WorkspaceResourceService";

import { ShareIcon, ArrowLeft, ArrowRight } from "../../icons";
import { UserInfo } from "../../../types/user";

import { WorkspaceFrame } from "../../../components";

const styles = {
  hide: {
    display: "none",
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: "nowrap",
    display: "flex",
  },
  drawerOpen: (theme) => ({
    top: "initial",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  drawerClose: (theme) => ({
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
  }),
  drawerPaper: {
    position: "static",
    flex: 1,
    display: "flex",
    bottom: 0,

    justifyContent: "space-between",
  },
  drawerHeader: (theme) => ({
    display: "flex",
    alignItems: "center",

    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }),
  closedTextBottom: {
    writingMode: "vertical-lr",
    textOrientation: "mixed",
    transform: "rotate(-180deg)",
    margin: "auto",
    position: "relative",
    bottom: 0,
    height: "70vh",
  },
  loading: (theme) => ({
    color: theme.palette.grey[600],
  }),
};

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
  const theme = useTheme();
  const { app } = useParams<{ app: string }>();
  const searchParams = useSearchParams()[0];

  // Keep drawer closed for jupyter by default
  const [open, setOpen] = React.useState(app === "jupyter" ? false : true);

  const getActiveResource = () => {
    
    const resourceFromParam = searchParams.get("resource");
    if (resourceFromParam) {
      return workspace.resources.find(
        (resource) => resource.name === resourceFromParam
      );
    } else if (workspace.lastOpen != null) {
      if (
        !app ||
        workspace.lastOpen?.type?.application === OSBApplications[app]
      ) {
        return workspace.lastOpen;
      }
    } else if (app) {
      return workspace.resources.find(
        (resource) =>
          resource.type?.application === OSBApplications[app] &&
          resource.status === ResourceStatus.available
      );
    } else if (workspace.resources?.length) {
      return workspace.resources.find(
        (resource) => resource.status === ResourceStatus.available
      );
    }
  };
  const currentResource = getActiveResource();

  React.useEffect(() => {
    if(user && workspace.user.id === user.id && currentResource) {
    workspaceResourceService
      .workspacesControllerWorkspaceResourceOpen(currentResource.id)
      .catch(() => {
        console.error("Error opening resource, ResourceOpen function failed!");
      });
    }
      return () => {}
    }, [currentResource]);

  const handleToggleDrawer = () => setOpen(!open);

  return (
    user &&
    workspace && (
      <Box
        display="flex"
        alignItems="stretch"
        flex="1"
        className="verticalFill"
        height={1}
      >
        <Drawer
          variant="permanent"
          anchor="left"
          elevation={0}
          open={open}
          sx={{
            ...styles.drawer,
            ...(open ? styles.drawerOpen(theme) : styles.drawerClose(theme)),
          }}
          slotProps={{
            paper: {
              sx: {
                ...styles.drawerPaper,
                ...(open ? styles.drawerOpen(theme) : styles.drawerClose(theme))
              }
            }
          }}
        >
          <div className="verticalFit" style={{ ...(open && { width: 400 }) }}>
            <WorkspaceInteractions
              workspace={workspace}
              open={open}
              currentResource={currentResource}
            />
          </div>
          <div>
            <Divider />
            <div style={styles.drawerHeader(theme)}>
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
    )
  );
};
