import * as React from "react";
import Box from "@material-ui/core/Box";

import ArrowUpIcon from "@material-ui/icons/ArrowDropUp";
import Typography from '@material-ui/core/Typography';
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ArrowDownIcon from "@material-ui/icons/ArrowDropDown";
import { ResourceStatus, Workspace, WorkspaceResource, ResourceType } from "../../../types/workspace";


import WorkspaceResourceService from '../../../service/WorkspaceResourceService';

import {
  FileLinkIcon,
  LoadingIcon,
  FolderIcon,
} from "../../icons";



const OSBTreeItem = (props: { resource: WorkspaceResource }) => {
  const { resource } = props;
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      {resource.type.application === null ? <FolderIcon /> : ""}
      <Typography style={{ opacity: resource.status === ResourceStatus.pending ? 0.3 : 1 }}>{resource.name}</Typography>
      {resource.status === ResourceStatus.pending ? <LoadingIcon /> : null}
    </Box>
  );
};


interface WorkspaceProps {
  workspace: Workspace;
}

export default (props: WorkspaceProps) => {
  const { workspace } = props;

  const resources = workspace.resources;

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
            label={<OSBTreeItem resource={resource} />}
          />)
        )
      }

    </TreeView>
  </Box>
  );
}
