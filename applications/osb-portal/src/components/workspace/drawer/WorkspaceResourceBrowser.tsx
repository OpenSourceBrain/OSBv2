import * as React from "react";
import Box from "@material-ui/core/Box";
import clsx from "clsx";
import { IconButton } from "@material-ui/core";
import ArrowUpIcon from "@material-ui/icons/ArrowDropUp";
import Typography from "@material-ui/core/Typography";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ArrowDownIcon from "@material-ui/icons/ArrowDropDown";
import DeleteIcon from "@material-ui/icons/Delete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";

import {
  ResourceStatus,
  Workspace,
  WorkspaceResource,
} from "../../../types/workspace";
import workspaceResourceService from "../../../service/WorkspaceResourceService";

import { FolderIcon } from "../../icons";

const openFileResource =
  (
    resource: WorkspaceResource,
    refreshWorkspace: any,
    openResource: (r: WorkspaceResource) => any
  ) =>
  (e: any) => {
    openResource(resource);
    return workspaceResourceService
      .workspacesControllerWorkspaceResourceOpen(resource.id)
      .then(() => {
        refreshWorkspace();
      })
      .catch(() => {
        console.error("Error opening resource, ResourceOpen function failed!");
      });
  };

const OSBTreeItem = (props: {
  resource: WorkspaceResource;
  active: boolean;
  refreshWorkspace: () => void;
  openResource: (r: WorkspaceResource) => any;
  lastOpenResourceId: number;
}) => {
  const {
    resource,
    active,
    refreshWorkspace,
    openResource,
    lastOpenResourceId,
  } = props;
  const canOpenFile: boolean = resource.status === ResourceStatus.available;
  const [waiting, setWaiting] = React.useState(
    resource.status === ResourceStatus.pending
  );
  const style: any = {
    fontWeight: active ? "bold" : "normal",
    opacity: resource.status === ResourceStatus.pending ? 0.3 : 1,
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

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
  return (
    <Box
      display="flex"
      alignItems="center"
      position="relative"
      justifyContent="space-between"
      fontWeight={active ? "bold" : "normal"}
      pl={2}
      pr={2}
      pt={1}
      pb={1}
      onClick={
        canOpenFile
          ? openFileResource(resource, refreshWorkspace, openResource)
          : undefined
      }
    >
      {resource.type.application === null ? <FolderIcon /> : ""}
      <Tooltip
        title={`${workspaceResourceService.getResourcePath(resource)}
      Click on this resource to open with ${resource.type.application.name}.`}
      >
        <Typography
          color={resource.status === ResourceStatus.error ? "error" : "initial"}
          style={style}
        >
          {resource.name}
        </Typography>
      </Tooltip>
      <Box ml={2}>
        {waiting && (
          <CircularProgress
            color="secondary"
            size="small"
            style={{ color: "#989898", width: "1em" }}
          />
        )}
        {!waiting && lastOpenResourceId !== resource.id && (
          <IconButton
            size="small"
            style={{ color: "#989898", padding: 0 }}
            title="Delete resource"
            onClick={handleDeleteResource}
          >
            <DeleteIcon fontSize="small" color="inherit" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

interface WorkspaceProps {
  workspace: Workspace;
  refreshWorkspace: () => void;
  openResource: (r: WorkspaceResource) => any;
}

const WorkspaceResourceBrowser = (props: WorkspaceProps) => {
  const { workspace, refreshWorkspace, openResource } = props;

  const lastOpenResourceId =
    workspace.lastOpen !== null ? workspace.lastOpen.id : -1;
  const resources = workspace.resources.filter(
    (resource) => resource.id !== undefined
  );

  resources.sort((elementA, elementB) => {
    return elementA.id === -1
      ? -1
      : elementA.name.toLowerCase() < elementB.name.toLowerCase()
      ? -1
      : elementA.name.toLowerCase() > elementB.name.toLowerCase()
      ? 1
      : 0;
  });

  if (!resources || resources.length === 0) {
    return null;
  }
  return (
    <Box className=" verticalFit scrollbar">
      <TreeView
        defaultCollapseIcon={<ArrowDownIcon />}
        defaultExpandIcon={<ArrowUpIcon />}
        defaultExpanded={["1", "10"]}
        expanded={["0"]}
      >
        {resources.map((resource: WorkspaceResource, idx: number) => (
          <TreeItem
            icon={undefined}
            key={resource.id}
            nodeId={idx + ""}
            className="first-level"
            label={
              <OSBTreeItem
                resource={resource}
                active={resource.id === lastOpenResourceId}
                refreshWorkspace={refreshWorkspace}
                openResource={openResource}
                lastOpenResourceId={lastOpenResourceId}
              />
            }
          />
        ))}
      </TreeView>
    </Box>
  );
};

export default WorkspaceResourceBrowser;
