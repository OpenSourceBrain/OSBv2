import * as React from "react";
import Box from "@material-ui/core/Box";
import { IconButton } from "@material-ui/core";
import ArrowUpIcon from "@material-ui/icons/ArrowDropUp";
import Typography from '@material-ui/core/Typography';
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ArrowDownIcon from "@material-ui/icons/ArrowDropDown";
import DeleteIcon from "@material-ui/icons/Delete";
import { ResourceStatus, Workspace, WorkspaceResource } from "../../../types/workspace";
import workspaceResourceService from "../../../service/WorkspaceResourceService";

import {
  LoadingIcon,
  FolderIcon,
} from "../../icons";




const openFileResource = (resource: WorkspaceResource, refreshWorkspace: any) => (e: any) => {
  const fileName = "/opt/workspace/" + resource.folder + "/" + resource.location.slice(resource.location.lastIndexOf("/") + 1);
  const r = workspaceResourceService.workspacesControllerWorkspaceResourceOpen(resource.id).then(() => {
    const iFrame: HTMLIFrameElement = document.getElementById("workspace-frame") as HTMLIFrameElement;
    iFrame.contentWindow.postMessage(fileName, '*');
    refreshWorkspace();
  }).catch(() => {
    console.error("Error opening resource, ResourceOpen function failed!");
  });
}

const OSBTreeItem = (props: { resource: WorkspaceResource, active: boolean, refreshWorkspace: () => null }) => {
  const { resource, active, refreshWorkspace } = props;
  const canOpenFile: boolean = resource.status === ResourceStatus.available;
  const style: any = {
    fontWeight: active ? "bold" : "normal",
    opacity: resource.status === ResourceStatus.pending ? 0.3 : 1
  };

  const handleDeleteResource = () => {
    workspaceResourceService.deleteResource(resource).then(() => refreshWorkspace(), () => console.error("could not update resource"));
  }
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      fontWeight={active ? "bold" : "normal"}
      onClick={canOpenFile ? openFileResource(resource, refreshWorkspace) : undefined}
    >
      {resource.type.application === null ? <FolderIcon /> : ""}
      <Typography style={style}>{resource.name}</Typography>
      {resource.status === ResourceStatus.pending ? <LoadingIcon /> : null}
      <IconButton size="small" style={{ color: "#989898" }} title="Delete resource" onClick={handleDeleteResource}>
        <DeleteIcon fontSize="small" color="inherit" />
      </IconButton>
    </Box>
  );
};


interface WorkspaceProps {
  workspace: Workspace;
  refreshWorkspace: any;
}

const WorkspaceResourceBrowser = (props: WorkspaceProps) => {
  const { workspace, refreshWorkspace } = props;

  const resources = workspace.resources;
  const lastOpenResourceId = workspace.lastOpen !== null ? workspace.lastOpen.id : -1;

  if (!resources) {
    return null;
  }
  return (<Box mt={1} mb={1}>
    <TreeView
      defaultCollapseIcon={<ArrowDownIcon />}
      defaultExpandIcon={<ArrowUpIcon />}
      defaultExpanded={["1", "10"]}
      expanded={["0"]}
    >
      {

        resources.filter(resource => resource.status !== ResourceStatus.error).map((resource: WorkspaceResource, idx: number) => (
          <TreeItem
            icon={undefined}
            key={idx}
            nodeId={idx + ''}
            className="first-level"
            label={<OSBTreeItem resource={resource} active={resource.id === lastOpenResourceId} refreshWorkspace={refreshWorkspace} />}
          />)
        )
      }

    </TreeView>
  </Box>
  );
}

export default WorkspaceResourceBrowser;
