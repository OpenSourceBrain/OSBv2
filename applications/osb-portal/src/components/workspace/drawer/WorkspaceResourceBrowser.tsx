import * as React from "react";
import Box from "@material-ui/core/Box";

import ArrowUpIcon from "@material-ui/icons/ArrowDropUp";
import Typography from '@material-ui/core/Typography';
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ArrowDownIcon from "@material-ui/icons/ArrowDropDown";
import { ResourceStatus, Workspace, WorkspaceResource } from "../../../types/workspace";
import WorkspaceResourceService from "../../../service/WorkspaceResourceService";

import {
  FileLinkIcon,
  LoadingIcon,
  FolderIcon,
} from "../../icons";
import { ActionLineWeight } from "material-ui/svg-icons";

const openFileResource = (resource: WorkspaceResource, refreshWorkspace: any) => (e: any) => {
  const fileName = resource.location.slice(resource.location.lastIndexOf("/") + 1);
  const r = WorkspaceResourceService.workspacesControllerWorkspaceResourceOpen(resource.id).then(() => {
    const iFrame: HTMLIFrameElement = document.getElementById("workspace-frame") as HTMLIFrameElement;
    iFrame.contentWindow.postMessage(fileName, '*');
    refreshWorkspace();
  }).catch(() => {
    alert("Error open resource, ResourceOpen function failed!");
  });
}

const OSBTreeItem = (props: { resource: WorkspaceResource, active: boolean, refreshWorkspace: any }) => {
  const { resource, active, refreshWorkspace } = props;
  const canOpenFile: boolean = resource.status === ResourceStatus.available;
  const style: any = {
    fontWeight: active ? "bold" : "normal",
    opacity: resource.status === ResourceStatus.pending ? 0.3 : 1
  };

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
    </Box>
  );
};


interface WorkspaceProps {
  workspace: Workspace;
  refreshWorkspace: any;
}

export default (props: WorkspaceProps) => {
  const { workspace, refreshWorkspace } = props;

  const resources = workspace.resources;
  const lastOpenResourceId = workspace.lastOpen !== null ? workspace.lastOpen.id : -1;

  if (!resources) {
    return null;
  }
  return (<Box p={1}>
    <TreeView
      defaultCollapseIcon={<ArrowDownIcon />}
      defaultExpandIcon={<ArrowUpIcon />}
      defaultExpanded={["1", "10"]}
      expanded={["0"]}
    >
      {

        resources.filter(resource => resource.status !== ResourceStatus.error).map((resource: WorkspaceResource, idx: number) => (
          <TreeItem
            icon={null}
            key={idx}
            nodeId={idx + ''}
            label={<OSBTreeItem resource={resource} active={resource.id === lastOpenResourceId} refreshWorkspace={refreshWorkspace}/>}
          />)
        )
      }

    </TreeView>
  </Box>
  );
}
