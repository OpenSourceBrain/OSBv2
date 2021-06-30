import * as React from "react";
import { Typography, Box, Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import { NewWorkspaceAskUser } from "..";
import Repositories from "../repository/Repositories";
import WorkspaceEdit from "./WorkspaceEditor";
import RepositoryResourceBrowser from "../repository/RepositoryResourceBrowser";
import OSBDialog from "../common/OSBDialog";
import OSBPagination from "../common/OSBPagination";
import { OSBRepository, RepositoryResourceNode } from '../../apiclient/workspaces';
import RepositoryService from "../../service/RepositoryService";
import { UserInfo } from "../../types/user";
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

const notebook = {
  name: "notebook",
  folder: '',
  type: SampleResourceTypes.g,
  location: window.location.origin + "/workspace-data/notebook.ipynb",
  workspaceId: -1
};

const WORKSPACE_TEMPLATES: { [id: string]: Workspace } = {
  [WorkspaceTemplateType.network]: {
    resources: [{
      name: "NetPyNE tutorials",
      type: SampleResourceTypes.m,
      origin: {
        path: "https://github.com/Neurosim-lab/netpyne_workspace/archive/master.zip"
      },
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
      origin: {
        path: "https://github.com/OpenSourceBrain/NWBShowcase/raw/master/FergusonEtAl2015/FergusonEtAl2015.nwb"
      },
      workspaceId: -1
    }],
    volume: null,
    shareType: null,
    name: null,
    description: null
  },
  [WorkspaceTemplateType.playground]: {
    resources: [{
      name: "notebook",
      type: SampleResourceTypes.g,
      origin: {
        path: window.location.origin + "/workspace-data/notebook.ipynb"
      },
      workspaceId: -1
    }],
    volume: null,
    shareType: null,
    name: null,
    description: null
  }
}

interface ItemProps {
  icon: React.ElementType | React.ReactNode;
  title: string,
  template?: WorkspaceTemplateType | string,
  user: UserInfo;
  refreshWorkspaces: () => null;
}

export default (props: ItemProps) => {
  const { user, template, title } = props;
  const [askLoginOpen, setAskLoginOpen] = React.useState(false);
  const [newWorkspaceOpen, setNewWorkspaceOpen] = React.useState(false);
  const [showAddFilesToWorkspaceDialog, setShowAddFilesToWorkspaceDialog] = React.useState(false);
  const [repositoryLoading, setRepositoryLoading] = React.useState(false);
  const [selectedRepository, setRepository] = React.useState<OSBRepository>(null);
  const [repositories, setRepositories] = React.useState<OSBRepository[]>(null);
  const [checked, setChecked] = React.useState<RepositoryResourceNode[]>([]);

  const [page, setPage] = React.useState(1);

  const [totalPages, setTotalPages] = React.useState(0);


  const workspaceTypeUndefined = () => { return typeof WORKSPACE_TEMPLATES[template] === 'undefined'; }
  const handlePageChange = (event: React.ChangeEvent<unknown>, pageNumber: number) => {
    setPage(pageNumber);
  }

  const loadRepository = (repositoryId: number) => {
    setRepositoryLoading(true);
    RepositoryService.getRepository(repositoryId).then((repo) => {
      setRepository(repo);
    });
  }
  const closeAddFilesToWorkspaceDialog = () => {
    setShowAddFilesToWorkspaceDialog(false);
  }

  const setCheckedArray = (newChecked: RepositoryResourceNode[]) => {
    setChecked(newChecked);
  }

  const handleClick = () => {
    if (!user) {
      setAskLoginOpen(true);
    } else {
      if (workspaceTypeUndefined){
        setShowAddFilesToWorkspaceDialog(true);

      }
      else{
        setNewWorkspaceOpen(true);
      }
    }
  };

  const handleBackAction = () => {
    setRepositoryLoading(false);
    setRepository(null);
    setChecked([]);
  }
  const closeAskLogin = () => setAskLoginOpen(false);

  const closeNewWorkspace = (refresh = false) => {
    setNewWorkspaceOpen(false);
    if (refresh) {
      props.refreshWorkspaces();
    }

  }
  let defaultWorkspace: Workspace;

  if (typeof WORKSPACE_TEMPLATES[template] === 'undefined'){
    defaultWorkspace = {
      resources: [],
      volume: null,
      shareType: null,
      name: "",
      description: null
    }
  }
  else{
    defaultWorkspace = WORKSPACE_TEMPLATES[template];
  }



  return (
    <>
      <Button style={{ textTransform: "none" }} onClick={handleClick}>
        <Box textAlign="center">
          <Box style={{ marginBottom: "0.2em" }} >
            {props.icon}
          </Box>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="caption">{typeof WORKSPACE_TEMPLATES[template] === 'undefined' ? template : defaultWorkspace.resources[0].type.application.name}</Typography>
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
      <OSBDialog
        title="select files for the new workspace"
        open={showAddFilesToWorkspaceDialog}
        closeAction={closeAddFilesToWorkspaceDialog}
      >
        {
          repositoryLoading ?
          selectedRepository ?
          <Box>
            <RepositoryResourceBrowser repository={selectedRepository} checkedChanged={setCheckedArray} backAction={handleBackAction}/>
          </Box>
          :
          <CircularProgress size={40}
            style={{
              position: 'relative',
              left: '45%',
            }}
          />
          : repositories ?
          <>
            <Box>
              <Repositories repositories={repositories} handleRepositoryClick={(repositoryId: number) => loadRepository(repositoryId)} showSimpleVersion={true} />
            </Box>
            {totalPages > 1 ? <OSBPagination totalPages={totalPages} handlePageChange={handlePageChange} color="primary" showFirstButton={true} showLastButton={true} /> :
            null
            }
          </>
          : null
        }
      </OSBDialog>
    </>
  );
};
