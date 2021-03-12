import * as React from "react";
import { Typography, Box, ButtonBase, Button } from "@material-ui/core";

import { UserInfo } from "../../types/user";
import OSBDialog from "../common/OSBDialog";
import { NewWorkspaceAskUser } from "..";
import WorkspaceEdit from "./WorkspaceEditor";
import { Workspace, SampleResourceTypes, OSBApplication } from "../../types/workspace";

export interface WorkspaceTemplate {
  title: string;
  application: OSBApplication;
}

export enum WorkspaceTemplateType {
  singleCell = 'singleCell',
  network = "network",
  explorer = "explorer",
  playground = "playground"
}

const WORKSPACE_TEMPLATES: { [id: string]: Workspace } = {
  [WorkspaceTemplateType.network]: {
    resources: [{
      name: "NetPyNE tutorials",
      type: SampleResourceTypes.m,
      location: "https://github.com/Neurosim-lab/netpyne_workspace/archive/master.zip",
      workspaceId: -1
    }],
    volume: null,
    shareType: null,
    name: null,
    description: null
  },
  [WorkspaceTemplateType.explorer]: {
    resources: [{
      name: "sample.nwb",
      type: SampleResourceTypes.e,
      location: "https://github.com/OpenSourceBrain/NWBShowcase/raw/master/FergusonEtAl2015/FergusonEtAl2015.nwb",
      workspaceId: -1
    }],
    volume: null,
    shareType: null,
    name: null,
    description: null
  },
  [WorkspaceTemplateType.playground]: {
    resources: [{
      name: "notebook.ipynb",
      type: SampleResourceTypes.g,
      location: window.location.origin + "/workspace-data/notebook.ipynb",
      workspaceId: -1
    }],
    volume: null,
    shareType: null,
    name: null,
    description: null
  }
}

interface ItemProps {
  icon: React.ElementType;
  title: string,
  template: WorkspaceTemplateType,
  user: UserInfo;
  refreshWorkspaces: () => null;
}

export default (props: ItemProps) => {
  const { user, template, title } = props;
  const [askLoginOpen, setAskLoginOpen] = React.useState(false);
  const [newWorkspaceOpen, setNewWorkspaceOpen] = React.useState(false);

  const handleClick = () => {
    if (!user) {
      setAskLoginOpen(true);
    } else {
      setNewWorkspaceOpen(true);
    }
  };

  const closeAskLogin = () => setAskLoginOpen(false);

  const closeNewWorkspace = (refresh = false) => {
    setNewWorkspaceOpen(false);
    if (refresh) {
      props.refreshWorkspaces();
    }

  }
  const defaultWorkspace: Workspace = WORKSPACE_TEMPLATES[template];

  return (
    <>
      <Button style={{ textTransform: "none" }} onClick={handleClick}>
        <Box textAlign="center">
          <props.icon style={{ marginBottom: "0.2em" }} />
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="caption">{defaultWorkspace.resources[0].type.application.name}</Typography>
        </Box>
      </Button>
      <OSBDialog
        title="Create new workspace"
        open={askLoginOpen}
        closeAction={closeAskLogin}
      >
        <NewWorkspaceAskUser />
      </OSBDialog>
      <OSBDialog
        title="Create new workspace"
        open={newWorkspaceOpen}
        closeAction={closeNewWorkspace}
      >
        <WorkspaceEdit workspace={defaultWorkspace} onLoadWorkspace={closeNewWorkspace} />
      </OSBDialog>
    </>
  );
};
