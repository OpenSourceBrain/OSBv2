import * as React from "react";
import { useNavigate } from "react-router-dom";

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
import { Typography } from "@mui/material";



const SidebarIconButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  "& .MuiSvgIcon-root": {
    color: paragraph,
    width: '1rem', 
    height: '1rem'
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
    padding: '0.25rem 1rem 0.25rem 2.25rem',
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
  "& .MuiListItemText-root": {
    margin: 0,
    maxWidth: '10rem'
  }
}));

const OSBResourceItem = (props: {
  resource: WorkspaceResource;
  active: boolean;
  refreshWorkspace: () => void;
  currentResourceId: number;
  Icon: JSX.Element;
  workspaceId: number;
}) => {
  const {
    resource,
    active,
    refreshWorkspace,
    workspaceId,
    Icon,
  } = props;
  const canOpenFile: boolean =
    resource.status === ResourceStatus.available;
  const [waiting, setWaiting] = React.useState(
    resource.status === ResourceStatus.pending
  );
  let navigate = useNavigate();

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
    navigate(
      {pathname: `/workspace/open/${workspaceId}/${resource.type.application.code}`,
      search: `?resource=${encodeURIComponent(resource.name)}`},
    )
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
  currentResource: WorkspaceResource;
  user: UserInfo;
}

const WorkspaceResourceBrowser = (props: WorkspaceProps) => {
  const { workspace, refreshWorkspace, currentResource } = props;

  const currentResourceId = currentResource?.id ?? -1;

  if (!workspace.resources || workspace.resources.length === 0) {
    return null;
  }
  
  const resources = workspace.resources.filter(
    (resource) => resource.id !== undefined && resource.id !== -1
  );



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
        <ListItemButton sx={{ pt: '4px', pb: '4px' }} onClick={() => setOpen(!open)}>
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
          <Typography>{resources.length}</Typography>
        </ListItemButton>
        <Box className="scrollbar" sx={{ paddingRight: '0 !important' }}>
          {open &&
            resources.map((resource) => (
              <OSBResourceItem
                key={resource.id}
                resource={resource}
                active={resource.id === currentResourceId}
                refreshWorkspace={refreshWorkspace}
                currentResourceId={currentResourceId}
                Icon={Icon}
                workspaceId={workspace.id}
              />
            ))}
        </Box>
      </>
    );
  };

  return (
    <Box className="verticalFill">
      <Box width="100%" className="verticalFill">
        <List className="verticalFill" sx={{ pt: 0, pb: 0 }}>
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
