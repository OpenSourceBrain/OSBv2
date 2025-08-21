import * as React from "react";
import { useNavigate } from "react-router-dom";

import { styled } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AddIcon from "@mui/icons-material/Add";

import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";

//icons
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CachedIcon from "@mui/icons-material/Cached";
import Box from "@mui/material/Box";
import WorkspaceResourceBrowser from "./WorkspaceResourceBrowser";

import { Workspace, WorkspaceResource } from "../../../types/workspace";

import AddResourceForm from "../AddResourceForm";
import { canEditWorkspace } from "../../../service/UserService";
import OSBDialog from "../../common/OSBDialog";
import { paragraph } from "../../../theme";
import { UserInfo } from "../../../types/user";
import { Typography } from "@mui/material";

function isWorkspaceWaiting(workspace: Workspace) {
   return workspace.resources.find(r => r.id < 0)
}

interface WorkspaceProps {
  workspace: Workspace;
  open?: boolean;
  refreshWorkspace?: () => void;
  refreshWorkspaceResources?: () => void;
  updateWorkspace: (ws: Workspace) => null;
  deleteWorkspace: (wsId: number) => null;
  user: UserInfo;
  [propName: string]: any;
  refreshWorkspacePage?: () => void;
  currentResource: WorkspaceResource;
  hideTabs: boolean;
  staticPage: boolean;
}

const SidebarBox = styled(Box)(() => ({
  // borderRight: `0.085rem solid ${borderColor}`,
  width: "100%",
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className="verticalFit"
      {...other}
    >
      {value === index && (
        children
      )}
    </Box>
  );
}

const SidebarIconButton = styled(IconButton)(() => ({
  padding: 0,
  "& .MuiSvgIcon-root": {
    color: paragraph,
    width: '1rem',
    height: '1rem',
    marginLeft: '0.25rem'
  },
  "&:hover": {
    background: "none",
  },
}));

export const WorkspaceInteractions = (props: WorkspaceProps | any) => {
  const { workspace, refreshWorkspace, hideTabs, refreshWorkspaceResources } = props;

  const [tabValue, setTabValue] = React.useState(0);

  const [addResourceOpen, setAddResourceOpen] = React.useState(false);

  const canEdit = canEditWorkspace(props.user, props.workspace);

  const showAddResource = () => {
    setAddResourceOpen(true);
  };

  const setAddResourceClosed = () => {
    setAddResourceOpen(false);
  };
  const handleResourceAdded = () => {
    setAddResourceOpen(false);
    refreshWorkspace();
  };

  React.useEffect(() => { 
    if(!isWorkspaceWaiting(workspace)) {
      refreshWorkspaceResources() }
   }, []);

  const handleRefreshResources = () => {
    refreshWorkspaceResources();
  }

  if (!workspace) {
    return null;
  }

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  const handleWorkspaceRefresh = () => {
    props.refreshWorkspace(workspace.id);
    if ("refreshWorkspacePage" in props) {
      props.refreshWorkspacePage();
    }
  };

  return (
    <>
      {props.open ? (
        <SidebarBox className="verticalFill">
          {!hideTabs && (
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                >
                  <Tab
                    label="Workspace"
                    sx={{ pl: "0.75rem", pr: "0.75rem", fontSize: "0.75rem" }}
                  />
                  <Tab
                    label="My Assets"
                    sx={{ pl: "0.75rem", pr: "0.75rem", fontSize: "0.75rem" }}
                  />
                </Tabs>
          </Box>
          )}
          <TabPanel value={tabValue} index={0}>
            <ListItem
              component="div"
              className="workspace-tab-header"
              disablePadding
              sx={{
                marginTop: '0.75rem',
                marginBottom: '0.75rem'
              }}
            >
              <ListItemButton sx={{
                padding: '0.25rem 0.75rem 0.25rem 1rem'
              }}>
                <ListItemText
                  primary="Workspace resources"
                  primaryTypographyProps={{
                    fontWeight: 600,
                    variant: "body2",
                  }}
                />
                <Stack direction="row">
                  <SidebarIconButton>
                    <Tooltip
                      sx={{ marginLeft: "0.3em" }}
                      title={
                        <>
                          Resources are special files that can be opened with
                          applications supported by Open Source Brain. To see
                          all your files, and upload non-resource files, please
                          open the workspace in the JupyterLab application.{" "}
                          <Link
                            href="https://docs.opensourcebrain.org/OSBv2/Workspaces.html"
                            target="_blank"
                            underline="hover"
                          >
                            Learn more...
                          </Link>
                        </>
                      }
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </Tooltip>
                  </SidebarIconButton>
                  
                  {canEdit ? (
                    <>
                      <Tooltip title="If resources have been manually added or updated inside the application, click here to sync">
                        <SidebarIconButton>
                          <CachedIcon sx={{ color: paragraph }} onClick={handleRefreshResources}/>
                        </SidebarIconButton>
                      </Tooltip>
                      <SidebarIconButton>
                        <AddOutlinedIcon
                          fontSize="small"
                          onClick={showAddResource}
                        />
                      </SidebarIconButton>
                    </>
                  ) : (
                    <Tooltip title="You do not have permissions to modify this workspace. Either clone it or create a new one if you need edit access.">
                      <SidebarIconButton>
                        <LockOutlinedIcon sx={{ color: paragraph }} />
                      </SidebarIconButton>
                    </Tooltip>
                  )}
                </Stack>
              </ListItemButton>
            </ListItem>
            <WorkspaceResourceBrowser
              workspace={workspace}
              currentResource={props.currentResource}
              refreshWorkspace={handleWorkspaceRefresh}
              user={props.user}
              staticPage={props.staticPage}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Box p={2} whiteSpace="normal">
              <Typography component="span">
                Files saved on <pre>/opt/user</pre> are available across all
                workspaces. To see your files, open the workspace with
                JupyterLab.
              </Typography>
            </Box>
          </TabPanel>
        </SidebarBox>
      ) : (
        <>
          <Box display="flex" flexDirection="column" height="auto" alignItems="center">
            {canEdit ? (
              <IconButton onClick={showAddResource} size="large">
                <AddIcon fontSize="small" />
              </IconButton>
            ) : (
              <IconButton size="large">
                <Tooltip title="You do not have permissions to modify this workspace.">
                  <LockOutlinedIcon sx={{ color: paragraph }} />
                </Tooltip>
              </IconButton>
            )}
            <Typography 
              variant="h6" 
              sx={{
                writingMode: "vertical-lr",
                textOrientation: "mixed",
                transform: "rotate(-180deg)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {props.workspace.name}
            </Typography>
          </Box>
        </>
      )}
      <OSBDialog
        title={
          <span>
            Add resources to
            <Typography
              component="span"
              sx={{
                color: "primary.main",
              }}
            >
              {" "}
              Workspace {workspace.name}
            </Typography>
          </span>
        }
        open={addResourceOpen}
        closeAction={() => setAddResourceOpen(false)}
        maxWidth="lg"
      >
        {canEdit && (
          <AddResourceForm
            workspace={workspace}
            onResourceAdded={handleResourceAdded}
            onSubmit={setAddResourceClosed}
          />
        )}
      </OSBDialog>
    </>
  );
};

export default WorkspaceInteractions;