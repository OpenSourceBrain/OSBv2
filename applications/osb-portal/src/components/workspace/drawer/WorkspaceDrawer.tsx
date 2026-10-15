import * as React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";

import { WorkspaceInteractions } from "../..";
import {
  OSBApplications,
  ResourceStatus,
  Workspace,
} from "../../../types/workspace";

import workspaceResourceService from "../../../service/WorkspaceResourceService";

import { ArrowLeft, ArrowRight } from "../../icons";
import { UserInfo } from "../../../types/user";
import { RootState } from "../../../store/rootReducer";

import { WorkspaceFrame } from "../../../components";
import { useCallback, useMemo } from "react";

const styles = {
  drawerContent: {
    width: 400,
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
  children?: React.ReactNode;
  app?: string; // App override, if not provided will use app from URL params
}

export const WorkspaceDrawer: React.FunctionComponent<WorkspaceDrawerProps> = ({
  children,
  app: appProp,
}) => {
  const workspace: Workspace | null = useSelector((state: RootState) => state.workspaces?.selectedWorkspace);
  const user: UserInfo = useSelector((state: RootState) => state.user);
  const { app } = useParams<{ app: string }>();
  const searchParams = useSearchParams()[0];

  // Use app from props if provided, otherwise from URL params
  const currentApp = appProp || app;

  // Keep drawer closed for jupyter by default
  const [open, setOpen] = React.useState(currentApp !== "jupyter");



  const getActiveResource = useCallback(() => {
    if(!workspace) {
      return undefined;
    }
    const resourceFromParam = searchParams.get("resource");
    if (resourceFromParam) {
      return workspace.resources.find(
        (resource) => resource.name === resourceFromParam
      );
    } else if (workspace.lastOpen != null) {
      if (
        !currentApp ||
        workspace.lastOpen?.type?.application === OSBApplications[currentApp]
      ) {
        return workspace.lastOpen;
      }
    } else if (currentApp) {
      return workspace.resources.find(
        (resource) =>
          resource.type?.application === OSBApplications[currentApp] &&
          resource.status === ResourceStatus.available
      );
    } else if (workspace.resources?.length) {
      return workspace.resources.find(
        (resource) => resource.status === ResourceStatus.available
      );
    }
    return undefined;
  }, [currentApp, searchParams, workspace]);

  const currentResource = useMemo( getActiveResource, [getActiveResource]);

  React.useEffect(() => {
    if(!workspace?.user?.id) {
      return;
    }
    if(user && workspace.user.id === user.id && currentResource) {
    workspaceResourceService
      .workspacesControllerWorkspaceResourceOpen(currentResource.id)
      .catch(() => {
        console.error("Error opening resource, ResourceOpen function failed!");
      });
    }
  }, [currentResource, user, workspace?.user.id]);

  const handleToggleDrawer = () => setOpen(!open);

  if (!workspace) {
    return <></>;
  }

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
            ...(open ? styles.drawerOpen : styles.drawerClose),
          }}
          PaperProps={{
            sx: {
              ...styles.drawerPaper,
              ...(open ? styles.drawerOpen : styles.drawerClose),
            }
          }}
        >
          <Box 
            sx={open ? styles.drawerContent : {}}
            className="verticalFit"
          >
            <WorkspaceInteractions
              workspace={workspace}
              open={open}
              currentResource={currentResource}
            />
          </Box>
          <Box>
            <Divider />
            <Box sx={styles.drawerHeader}>
              <IconButton onClick={handleToggleDrawer} size="large">
                {open ? (
                  <ArrowLeft style={{ fontSize: "1rem" }} />
                ) : (
                  <ArrowRight style={{ fontSize: "1rem" }} />
                )}
              </IconButton>
            </Box>
          </Box>
        </Drawer>

        <Box display="flex" flex="1">
          <WorkspaceFrame currentResource={currentResource} />
          {children}
        </Box>
      </Box>
    )
  );
};
