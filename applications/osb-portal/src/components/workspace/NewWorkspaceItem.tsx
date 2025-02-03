import * as React from "react";

import { Typography, Box, Button } from "@mui/material";

import { WorkspaceEditor } from "../index";

import { UserInfo } from "../../types/user";
import {
  Workspace,
  SampleResourceTypes,
  OSBApplication,
} from "../../types/workspace";
import WorkspaceFromRepository from "./WorkspaceFromRepository";

//style
import {
  secondaryColor,
  bgLightest,
  bgLight,
  badgeBgLight,
  lightWhite,
} from "../../theme";
import ConfirmationDialog from "../dialogs/WorkspaceConfirmDialog";
import WorkspaceConfirmDialog from "../dialogs/WorkspaceConfirmDialog";

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
        resourceType: "m",
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
        resourceType: "e",
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
        resourceType: "g",
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
  className?: string;
  closeMainDialog?: (isClosed: boolean) => void;
}

const style = {
  borderRadius: "6px",
  width: " 100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "1rem 0",

  "&:hover": {
    backgroundColor: bgLightest,

    "& .MuiButtonBase-root": {
      "& .MuiSvgIcon-root": {
        fill: badgeBgLight,
      },
    },
  },

  color: secondaryColor,


  "& .MuiSvgIcon-root": {
    fontSize: "2rem",
    fill: bgLight,
  },

  "& .MuiTypography-caption": {
    textTransform: "uppercase",
  },
};

export const NewWorkspaceItem = (props: ItemProps) => {
  const { template, title, refreshWorkspaces, className, icon } = props;

  const [newWorkspaceOpen, setNewWorkspaceOpen] = React.useState(false);
  const [workspaceLink, setWorkspaceLink] = React.useState("");

  const handleClick = () => {
    setNewWorkspaceOpen(true);
  };

  const [createdWorkspaceConfirmationContent, setCreatedWorkspaceConfirmationContent] = React.useState({
    title: "",
    content: "",
    isSuccess: false,
    showConfirmationDialog: false,
  });

  const handleCloseConfirmationDialog = () => {
    setCreatedWorkspaceConfirmationContent({
      title: "",
      content: "",
      isSuccess: false,
      showConfirmationDialog: false,
    });
    props.closeMainDialog(false);
  }

  const onWorkspaceCreated = (refresh = false, ws: Workspace) => {
    if (refresh) {
      refreshWorkspaces();
    }

    // if non-default workspace
    if (defaultWorkspace) {
      setWorkspaceLink(`/workspaces/${ws.id}`);
      setCreatedWorkspaceConfirmationContent((prevContent) => ({
        ...prevContent,
        title: "Success!",
        content: "New workspace created.",
        isSuccess: true,
        showConfirmationDialog: true,
      }));
    }
  };

  // default workspace - other - computational modeling (NETPYNE), data analysis (NWB Explorer), interactive development (JupyterLab)
  // non default workspace - Create new workspace from repository
  const defaultWorkspace: Workspace = WORKSPACE_TEMPLATES[template];
  return (
    <>
      <Button sx={style} onClick={handleClick} className={className}>
        <Box textAlign="center">
          {icon}
          <Typography variant="subtitle1" sx={{ marginBottom: "0.286rem" }}>
            {title}
          </Typography>
          <Typography variant="caption">
            {typeof WORKSPACE_TEMPLATES[template] === "undefined"
              ? template
              : defaultWorkspace.resources[0].type.application.name}
          </Typography>
        </Box>
      </Button>

      {newWorkspaceOpen &&
        (defaultWorkspace ? (
        <>
          {createdWorkspaceConfirmationContent.showConfirmationDialog
            ? (
              <WorkspaceConfirmDialog
                setChecked={(x) => null}
                createdWorkspaceConfirmationContent={createdWorkspaceConfirmationContent}
                workspaceLink={workspaceLink}
                handleCloseConfirmationDialog={handleCloseConfirmationDialog}
              />
            ) : (
              <WorkspaceEditor
                title="Create new workspace"
                open={newWorkspaceOpen}
                user={props.user}
                workspace={defaultWorkspace}
                onLoadWorkspace={onWorkspaceCreated}
                closeHandler={() => setNewWorkspaceOpen(false)}
              />
            )
          }
        </>
        ) : (
          <WorkspaceFromRepository
            close={() => setNewWorkspaceOpen(false)}
            workspaceCreatedCallback={onWorkspaceCreated}
            closeMainDialog={(isClosed) => props.closeMainDialog(isClosed)}
          />
        ))
      }
    </>
  );
};

export default NewWorkspaceItem;
