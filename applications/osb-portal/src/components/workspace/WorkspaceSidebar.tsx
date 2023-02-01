import * as React from "react";
import PropTypes from "prop-types";
import { useHistory, useParams } from "react-router";

//theme
import { styled } from "@mui/styles";

import {
  bgRegular as borderColor,
  paragraph,
  workspaceItemBg,
  orangeText,
  lightWhite,
  bgInputs,
} from "../../theme";

//components
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import OSBDialog from "../common/OSBDialog";
import AddResourceForm from "./AddResourceForm";
import { canEditWorkspace } from "../../service/UserService";

//types
import {
  Workspace,
  WorkspaceResource,
  OSBApplication,
} from "../../types/workspace";
import { UserInfo } from "../../types/user";

//icons
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import DownloadingIcon from "@mui/icons-material/Downloading";
import { AreaChartIcon, ViewInArIcon } from "../icons";

const SidebarBox = styled(Box)(({ theme }) => ({
  borderRight: `0.085rem solid ${borderColor}`,
  width: "100%",
}));

const SidebarIconButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  "& .MuiSvgIcon-root": {
    color: paragraph,
  },
  "&:hover": {
    background: "none",
  },
}));

const ResourceItem = styled(ListItem)(({ theme }) => ({
  color: lightWhite,
  "& .MuiIconButton-root": {
    color: lightWhite,
  },
  "& .MuiListItemButton-root": {
    paddingLeft: "2.571rem",
    paddingTop: 0,
    paddingBottom: 0,
    "&:hover": {
      background: workspaceItemBg,
      "& .MuiTypography-root": {
        color: orangeText,
      },
    },
  },
  "& .MuiTypography-root": {
    fontWeight: 400,
    fontSize: "0.75rem",
    paddingLeft: "0.286rem",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "150px",
  },
  "&:hover": {
    "& .MuiListItemSecondaryAction-root .MuiIconButton-root": {
      visibility: "inherit",
    },
    "& .MuiTypography-root": {
      color: orangeText,
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ maxHeight: 480, overflowY: "scroll" }}>{children}</Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

interface WorkspaceProps {
  workspace: Workspace;
  open?: boolean;
  refreshWorkspace?: () => void;
  updateWorkspace: (ws: Workspace) => null;
  deleteWorkspace: (wsId: number) => null;
  user: UserInfo;
  [propName: string]: any;
  openResource: (r: WorkspaceResource) => any;
  refreshWorkspacePage?: () => void;
  currentResource: WorkspaceResource;
}

const WorkspaceSidebar = (props: WorkspaceProps | any) => {
  const history = useHistory();

  const dialogTitle = (
    <>
      <span>
        Add resources to
        <span> Workspace {props.workspace.name}</span>
      </span>
    </>
  );

  const [tabValue, setTabValue] = React.useState(0);
  const [openE, setOpenE] = React.useState(false);
  const [openM, setOpenM] = React.useState(false);
  const [openG, setOpenG] = React.useState(false);
  const { resources } = props.workspace;
  const [addResourceOpen, setAddResourceOpen] = React.useState(false);

  const pendingResource = resources.some((e) => e.status == "PENDING");

  const canEdit = canEditWorkspace(props.user, props.workspace);

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const openWithApp = (selectedOption: OSBApplication) => {
    history.push(`/workspace/open/${workspaceId}/${selectedOption.code}`);
  };
  const handleResourceClick = (resource: WorkspaceResource) => {
    openWithApp(resource.type.application);
  };
  const showAddResource = () => {
    setAddResourceOpen(true);
  };
  const setAddResourceClosed = () => {
    setAddResourceOpen(false);
  };
  const handleResourceAdded = () => {
    setAddResourceOpen(false);
    handleWorkspaceRefresh();
  };
  const handleWorkspaceRefresh = () => {
    props.refreshWorkspace(props.workspace.id);
    if ("refreshWorkspacePage" in props) {
      props.refreshWorkspacePage();
    }
  };
  console.log("Resources: ", resources);

  return (
    props.workspace && (
      <SidebarBox>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab
              label="Workspace"
              sx={{ pl: "0.75rem", pr: "0.75rem", fontSize: "0.75rem" }}
            />
            <Tab
              label="User Assets"
              sx={{ pl: "0.75rem", pr: "0.75rem", fontSize: "0.75rem" }}
              disabled
            />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <ListItem
            component="div"
            className="workspace-tab-header"
            disablePadding
          >
            <ListItemButton>
              <ListItemText
                primary="Experiment shortcuts"
                primaryTypographyProps={{
                  fontWeight: 600,
                  variant: "body2",
                }}
              />
              <Stack direction="row" spacing={1}>
                <SidebarIconButton>
                  <Tooltip
                    sx={{ marginLeft: "0.3em" }}
                    title={
                      <>
                        Resources are special files that can be opened with
                        applications supported by Open Source Brain. To see all
                        your files, and upload non-resource files, please open
                        the workspace in the JupyterLab application.{" "}
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
                {canEdit && (
                  <SidebarIconButton>
                    <AddOutlinedIcon
                      fontSize="small"
                      onClick={showAddResource}
                    />
                  </SidebarIconButton>
                )}
              </Stack>
            </ListItemButton>
          </ListItem>
          <List>
            <ListItemButton onClick={() => setOpenE(!openE)}>
              <SidebarIconButton>
                {openE ? (
                  <ExpandLess fontSize="small" />
                ) : (
                  <ExpandMore fontSize="small" />
                )}
              </SidebarIconButton>
              <ListItemText
                primary="NWB File"
                primaryTypographyProps={{
                  fontWeight: 600,
                  variant: "body2",
                  pl: "0.286rem",
                }}
              />
            </ListItemButton>
            {openE &&
              resources
                .filter((resource) => resource.resourceType === "e")
                .map((resource) => (
                  <ResourceItem
                    disablePadding
                    key={resource.id}
                    secondaryAction={
                      <SidebarIconButton
                        edge="end"
                        aria-label="delete"
                        sx={{
                          visibility: "hidden",
                        }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </SidebarIconButton>
                    }
                  >
                    <ListItemButton
                      onClick={() => handleResourceClick(resource)}
                    >
                      <SidebarIconButton>
                        <AreaChartIcon fontSize="small" />
                      </SidebarIconButton>
                      <Tooltip
                        sx={{ marginLeft: "0.3em" }}
                        title={<>{resource.name}</>}
                      >
                        <ListItemText primary={resource.name} />
                      </Tooltip>
                    </ListItemButton>
                  </ResourceItem>
                ))}
            <ListItemButton onClick={() => setOpenM(!openM)}>
              <SidebarIconButton>
                {openM ? (
                  <ExpandLess fontSize="small" />
                ) : (
                  <ExpandMore fontSize="small" />
                )}
              </SidebarIconButton>
              <ListItemText
                primary="NetPyNE model"
                primaryTypographyProps={{
                  fontWeight: 600,
                  variant: "body2",
                  pl: "0.286rem",
                }}
              />
            </ListItemButton>
            {openM &&
              resources
                .filter((resource) => resource.resourceType === "m")
                .map((resource) => (
                  <ResourceItem
                    disablePadding
                    key={resource.id}
                    sx={{
                      "&:hover": {
                        "& .MuiListItemSecondaryAction-root .MuiIconButton-root":
                          {
                            visibility: "inherit",
                          },
                      },
                    }}
                    secondaryAction={
                      <SidebarIconButton
                        edge="end"
                        aria-label="delete"
                        sx={{ visibility: "hidden" }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </SidebarIconButton>
                    }
                  >
                    <ListItemButton>
                      <SidebarIconButton>
                        <ViewInArIcon fontSize="small" />
                      </SidebarIconButton>
                      <Tooltip
                        sx={{ marginLeft: "0.3em" }}
                        title={<>{resource.name}</>}
                      >
                        <ListItemText primary={resource.name} />
                      </Tooltip>
                    </ListItemButton>
                  </ResourceItem>
                ))}
            <ListItemButton onClick={() => setOpenG(!openG)}>
              <SidebarIconButton>
                {openG ? (
                  <ExpandLess fontSize="small" />
                ) : (
                  <ExpandMore fontSize="small" />
                )}
              </SidebarIconButton>
              <ListItemText
                primary="Generic file"
                primaryTypographyProps={{
                  fontWeight: 600,
                  variant: "body2",
                  pl: "0.286rem",
                }}
              />
            </ListItemButton>
            {openG &&
              resources
                .filter((resource) => resource.resourceType === "g")
                .map((resource) => (
                  <ResourceItem
                    disablePadding
                    key={resource.id}
                    secondaryAction={
                      <SidebarIconButton
                        edge="end"
                        aria-label="delete"
                        sx={{ visibility: "hidden" }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </SidebarIconButton>
                    }
                  >
                    <ListItemButton>
                      <SidebarIconButton>
                        <StickyNote2OutlinedIcon fontSize="small" />
                      </SidebarIconButton>
                      <Tooltip
                        sx={{ marginLeft: "0.3em" }}
                        title={<>{resource.name}</>}
                      >
                        <ListItemText primary={resource.name} />
                      </Tooltip>
                    </ListItemButton>
                  </ResourceItem>
                ))}
          </List>
          {pendingResource && (
            <ListItem
              component="div"
              className="workspace-tab-header"
              disablePadding
              sx={{
                pointerEvents: "none",
                "&:hover": {
                  background: "none",
                },
              }}
            >
              <ListItemButton>
                <ListItemText
                  primary="Importing resources..."
                  primaryTypographyProps={{
                    variant: "body2",
                    color: bgInputs,
                  }}
                />
                <SidebarIconButton>
                  <DownloadingIcon fontSize="small" sx={{ fill: bgInputs }} />
                </SidebarIconButton>
              </ListItemButton>
            </ListItem>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          User Assets
        </TabPanel>
        {
          <OSBDialog
            title={dialogTitle}
            open={addResourceOpen}
            closeAction={() => setAddResourceOpen(false)}
            maxWidth="md"
          >
            {canEdit && (
              <AddResourceForm
                workspace={props.workspace}
                onResourceAdded={handleResourceAdded}
                onSubmit={setAddResourceClosed}
              />
            )}
          </OSBDialog>
        }
      </SidebarBox>
    )
  );
};
export default WorkspaceSidebar;
