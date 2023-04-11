import * as React from "react";

//theme
import { styled } from "@mui/styles";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";

import { UserInfo } from "../../../types/user";

//icons
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DownloadingIcon from "@mui/icons-material/Downloading";

import { AreaChartIcon, ViewInArIcon } from "../../icons";

import {
  ResourceStatus,
  Workspace,
  WorkspaceResource,
} from "../../../types/workspace";
import workspaceResourceService from "../../../service/WorkspaceResourceService";

import {
  paragraph,
  workspaceItemBg,
  orangeText,
  lightWhite,
  bgInputs,
} from "../../../theme";
import { ResourceType } from "../../../apiclient/workspaces";



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
    },
  },
  "& .MuiTypography-root": {
    fontWeight: 400,
    fontSize: "0.75rem",
    paddingLeft: "0.286rem",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },
  "& .Mui-disabled.active": {
    opacity: 1
  },
  "&:hover": {
    "& .MuiListItemSecondaryAction-root .MuiIconButton-root": {
      visibility: "inherit",
    },

  },
  "& .active .MuiTypography-root": {
    color: orangeText,
  },
}));

const OSBResourceItem = (props: {
  resource: WorkspaceResource;
  active: boolean;
  refreshWorkspace: () => void;
  openResource: (r: WorkspaceResource) => any;
  lastOpenResourceId: number;
  Icon: JSX.Element;
  openResourceAction?: (resource: WorkspaceResource) => void;
}) => {
  const {
    resource,
    active,
    refreshWorkspace,
    openResource,
    openResourceAction,
    Icon,
  } = props;
  const canOpenFile: boolean =
    resource.status === ResourceStatus.available && !active;
  const [waiting, setWaiting] = React.useState(
    resource.status === ResourceStatus.pending
  );

  React.useEffect(() => {
    setWaiting(resource.status === ResourceStatus.pending);
  }, [resource]);

  const handleDeleteResource = (e: any | Event) => {
    e.preventDefault();
    setWaiting(true);
    workspaceResourceService
      .deleteResource(resource)
      .then(() => {
        refreshWorkspace();
        setWaiting(false);
      })
      .catch(() => console.error("could not update resource"));
  };

  const handleOpenResource =
  (e: any) => {
    openResource && openResource(resource);
    return workspaceResourceService
      .workspacesControllerWorkspaceResourceOpen(resource.id)
      .then(openResourceAction ? (() => openResourceAction(resource)) : refreshWorkspace)
      .catch(() => {
        console.error("Error opening resource, ResourceOpen function failed!");
      });
  };

  return (
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
          {!active && <DeleteOutlinedIcon fontSize="small" onClick={handleDeleteResource} />}
        </SidebarIconButton>
      }
    >
      <ListItemButton
        className={active ? "active" : ""}
        disabled={active || resource.status !== ResourceStatus.available}
        onClick={canOpenFile ? handleOpenResource : undefined}
      >
        <SidebarIconButton>{Icon}</SidebarIconButton>
        <Tooltip
          sx={{ marginLeft: "0.3em" }}

          placement="right-end"
          title={`${workspaceResourceService.getResourcePath(resource)}.
            ${
              active
                ? "This is the resource currently opened on"
                : "Click on this resource to open with"
            } ${resource.type.application.name}.`}
        >
          <ListItemText primary={resource.name} />
        </Tooltip>
      </ListItemButton>
    </ResourceItem>
  );
};

interface WorkspaceProps {
  workspace: Workspace;
  refreshWorkspace: () => void;
  openResource?: (r: WorkspaceResource) => any;
  currentResource: WorkspaceResource;
  user: UserInfo;
  openResourceAction?: (resource: WorkspaceResource) => void;
}

const WorkspaceResourceBrowser = (props: WorkspaceProps) => {
  const { workspace, refreshWorkspace, openResource, currentResource, openResourceAction } = props;

  const lastOpenResourceId = currentResource?.id ?? -1;

  const resources = workspace.resources.filter(
    (resource) => resource.id !== undefined && resource.id !== -1
  );

  if (!resources || resources.length === 0) {
    return null;
  }

  const experimentalResources = resources.filter(
    (resource) => resource.resourceType === ResourceType.E
  );
  const modelResources = resources.filter(
    (resource) => resource.resourceType === ResourceType.M
  );
  const notebookResources = resources.filter(
    (resource) => resource.resourceType === ResourceType.G
  );

  const pendingResource = workspace.resources.find((res) => res.id === -1);

  const ResourceTreeGroup = (tprops: {
    label: string;
    Icon: JSX.Element;
    defaultOpen?: boolean;
    resources: WorkspaceResource[];
  }) => {
    const { label, Icon, defaultOpen, resources } = tprops;
    const [open, setOpen] = React.useState(defaultOpen);

    return (
      <>
        <ListItemButton onClick={() => setOpen(!open)}>
          <SidebarIconButton>
            {open ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )}
          </SidebarIconButton>
          <ListItemText
            primary={label}
            primaryTypographyProps={{
              fontWeight: 600,
              variant: "body2",
              pl: "0.286rem",
            }}
          />
        </ListItemButton>
        <Box className="scrollbar">
          {open &&
            resources.map((resource) => (
              <OSBResourceItem
                key={resource.id}
                resource={resource}
                active={resource.id === lastOpenResourceId}
                refreshWorkspace={refreshWorkspace}
                openResource={openResource}
                lastOpenResourceId={lastOpenResourceId}
                openResourceAction={openResourceAction}
                Icon={Icon}
              />
            ))}
        </Box>
      </>
    );
  };

  return (
    <Box className="verticalFill">
      <Box width="100%" className="verticalFill">
        <List className="verticalFill">
          {experimentalResources.length > 0 && (
            <ResourceTreeGroup
              resources={experimentalResources}
              defaultOpen={currentResource && currentResource.resourceType === ResourceType.E}
              label={"Experiment Data"}
              Icon={<AreaChartIcon fontSize="small" />}
            />
          )}
          {modelResources.length > 0 && (
            <ResourceTreeGroup
              resources={modelResources}
              defaultOpen={currentResource && currentResource.resourceType === ResourceType.M}
              label={"Models"}
              Icon={<ViewInArIcon fontSize="small" />}
            />
          )}
          {notebookResources.length > 0 && (
            <ResourceTreeGroup
              resources={notebookResources}
              defaultOpen={currentResource && currentResource.resourceType === ResourceType.G}
              label={"Notebooks"}
              Icon={<StickyNote2OutlinedIcon fontSize="small" />}
            />
          )}
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
                primary={pendingResource.name + "..."}
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
      </Box>
    </Box>
  );
};

export default WorkspaceResourceBrowser;
