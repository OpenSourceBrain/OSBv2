import * as React from "react";
import Box from "@material-ui/core/Box";
import { IconButton } from "@material-ui/core";
import ArrowUpIcon from "@material-ui/icons/ArrowDropUp";
import Typography from '@material-ui/core/Typography';
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ArrowDownIcon from "@material-ui/icons/ArrowDropDown";
import DeleteIcon from "@material-ui/icons/Delete";
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

import { ResourceStatus, Workspace, WorkspaceResource } from "../../../types/workspace";
import workspaceResourceService from "../../../service/WorkspaceResourceService";

import {
  LoadingIcon,
  FolderIcon,
} from "../../icons";
import { CSSProperties } from "@material-ui/styles";




const openFileResource = (resource: WorkspaceResource, refreshWorkspace: any) => (e: any) => {
  const fileName = "/opt/workspace/" + workspaceResourceService.getResourcePath(resource);
  const r = workspaceResourceService.workspacesControllerWorkspaceResourceOpen(resource.id).then(() => {
    const iFrame: HTMLIFrameElement = document.getElementById("workspace-frame") as HTMLIFrameElement;
    iFrame.contentWindow.postMessage(fileName, '*');
    refreshWorkspace();
  }).catch(() => {
    console.error("Error opening resource, ResourceOpen function failed!");
  });
}

const coverAbsolute: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.6)',
  textAlign: "right",
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const ItemCover = ({ children, className }: { children: any, className: string }) => <Box
  pl={2}
  pr={2}
  className={className}
  style={coverAbsolute}
>
  {children}
</Box>

const OSBTreeItem = (props: { resource: WorkspaceResource, active: boolean, refreshWorkspace: () => null }) => {
  const { resource, active, refreshWorkspace } = props;
  const canOpenFile: boolean = resource.status === ResourceStatus.available;
  const [waiting, setWaiting] = React.useState(false);
  const style: any = {
    fontWeight: active ? "bold" : "normal",
    opacity: resource.status === ResourceStatus.pending ? 0.3 : 1
  };

  const handleDeleteResource = () => {
    setWaiting(true)
    workspaceResourceService.deleteResource(resource).then(() => refreshWorkspace(), () => console.error("could not update resource"));
  }
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
      onClick={canOpenFile ? openFileResource(resource, refreshWorkspace) : undefined}
    >
      {resource.type.application === null ? <FolderIcon /> : ""}
      <Tooltip title={workspaceResourceService.getResourcePath(resource)}>
        <Typography color={resource.status === ResourceStatus.error ? "error" : "initial"} style={style}>{resource.name}</Typography>
      </Tooltip>
      <Box display="flex" alignItems="center" >
        {resource.status === ResourceStatus.pending ? <LoadingIcon /> : null}
        <IconButton size="small" disabled={waiting} style={{ color: "#989898" }} title="Delete resource" onClick={handleDeleteResource} >
          <DeleteIcon fontSize="small" color="inherit" />
        </IconButton>
      </Box>

      {
        waiting && <ItemCover className="">
          <CircularProgress
            size={24}
          />
        </ItemCover>
      }
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

  if (!resources || resources.length === 0) {
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

        resources
          .map((resource: WorkspaceResource, idx: number) => (
            <TreeItem
              icon={undefined}
              key={idx + ''}
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
