import * as React from "react";

import { Typography, Box, Button } from "@mui/material";

import { NewWorkspaceAskUser } from "..";
import { WorkspaceEditor } from "../index";

import OSBDialog from "../common/OSBDialog";

import { UserInfo } from "../../types/user";
import {
  Workspace,
  SampleResourceTypes,
  OSBApplication,
} from "../../types/workspace";
import WorkspaceFromRepository from "./WorkspaceFromRepository";

export interface WorkspaceTemplate {
  title: string;
  application: OSBApplication;
}

export enum WorkspaceTemplateType {
  singleCell = "singleCell",
  network = "network",
  explorer = "explorer",
  playground = "playground",
}

const notebook = {
  name: "notebook",
  folder: "",
  type: SampleResourceTypes.g,
  location: window.location.origin + "/workspace-data/notebook.ipynb",
  workspaceId: -1,
};

const WORKSPACE_TEMPLATES: { [id: string]: Workspace } = {
  [WorkspaceTemplateType.network]: {
    resources: [
      {
        name: "NetPyNE tutorials",
        type: SampleResourceTypes.m,
        origin: {
          path: "https://github.com/Neurosim-lab/netpyne_workspace/archive/master.zip",
        },
        workspaceId: -1,
      },
    ],
    volume: null,
    shareType: null,
    name: null,
    description: null,
  },
  [WorkspaceTemplateType.explorer]: {
    resources: [
      {
        name: "sample.nwb",
        type: SampleResourceTypes.e,
        origin: {
          path: "https://github.com/OpenSourceBrain/NWBShowcase/raw/master/FergusonEtAl2015/FergusonEtAl2015.nwb",
        },
        workspaceId: -1,
      },
    ],
    volume: null,
    shareType: null,
    name: null,
    description: null,
  },
  [WorkspaceTemplateType.playground]: {
    resources: [
      {
        name: "notebook",
        type: SampleResourceTypes.g,
        origin: {
          path: window.location.origin + "/workspace-data/notebook.ipynb",
        },
        workspaceId: -1,
      },
    ],
    volume: null,
    shareType: null,
    name: null,
    description: null,
  },
};

interface ItemProps {
  icon: React.ElementType | React.ReactNode;
  title: string;
  template?: WorkspaceTemplateType | string;
  user: UserInfo;
  refreshWorkspaces: () => null;
  className: string;
}

export const NewWorkspaceItem = (props: ItemProps) => {
  const { user, template, title, refreshWorkspaces, className, icon } = props;

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

  const onWorkspaceCreated = (refresh = false, ws: Workspace) => {
    document.getElementById("your-all-workspaces-tab").click();

    setNewWorkspaceOpen(false);
    if (refresh) {
      refreshWorkspaces();
    }
  };

  const defaultWorkspace: Workspace = WORKSPACE_TEMPLATES[template];

  return (
    <div className={className}>
      <Button style={{ textTransform: "none" }} onClick={handleClick}>
        <Box textAlign="center">
          {icon}
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="caption">
            {typeof WORKSPACE_TEMPLATES[template] === "undefined"
              ? template
              : defaultWorkspace.resources[0].type.application.name}
          </Typography>
        </Box>
      </Button>
      {askLoginOpen && (
        <OSBDialog
          title="Create new workspace"
          open={askLoginOpen}
          closeAction={closeAskLogin}
        >
          <NewWorkspaceAskUser />
        </OSBDialog>
      )}
      {newWorkspaceOpen &&
        (defaultWorkspace ? (
          <WorkspaceEditor
            title="Create new workspace"
            open={newWorkspaceOpen}
            user={props.user}
            workspace={defaultWorkspace}
            onLoadWorkspace={onWorkspaceCreated}
            closeHandler={() => setNewWorkspaceOpen(false)}
          />
        ) : (
          <WorkspaceFromRepository
            close={() => setNewWorkspaceOpen(false)}
            workspaceCreatedCallback={onWorkspaceCreated}
          />
        ))}
    </div>
  );
};

export default NewWorkspaceItem;
