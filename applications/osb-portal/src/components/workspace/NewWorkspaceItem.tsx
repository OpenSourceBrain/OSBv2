import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
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
import {
  fontColor,
  bgInputs,
  radius,
  bgLight,
  bgDarker,
} from "../../theme";
import OSBChipList from "../common/OSBChipList";
import Grid from "@material-ui/core/Grid";

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

const useStyles = makeStyles((theme) => ({
  helperDialogText: {
    padding: `0px ${theme.spacing(1)}px ${theme.spacing(1)}px`,
    fontSize: '0.9rem',
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    "& .MuiTypography-root": {
      paddingLeft: 0,
    },
  },
  repositoriesList: {
    "& .MuiBox-root": {
      maxHeight: '500px',
      margin: theme.spacing(2),
      borderRadius: radius,
      "& .MuiGrid-container": {
        backgroundColor: bgLight,
        "&:hover": {
          backgroundColor: bgDarker,
        },
      },
    },
  },
  resourceBrowser: {
    overflow: 'hidden',
    borderRadius: radius,
    backgroundColor: bgLight,
    margin: theme.spacing(2),
    "& .scrollbar": {
      overflow: 'auto',
      maxHeight: '400px',
      "& .MuiList-root": {
        paddingRight: '1rem',
        marginTop: 0,
        "& .MuiListItem-root": {
          alignItems: 'baseline',
        },
        "& p": {
          fontSize: '0.8rem',
          color: fontColor,
          "& span": {
            fontSize: '0.8rem',
            color: bgInputs,
          },
          "& .icon": {
            width: '2rem',
            display: 'flex',
            "& .MuiSvgIcon-root": {
              height: '1rem',
            },
          },
        },
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: bgInputs,
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: 'transparent',
      },
    },
    "& .flex-grow-1": {
      width: '100%',
    },
    "& .MuiTextField-root": {
      width: '96%',
      marginRight: '2%',
      marginLeft: '2%',
      padding: '0.6rem',
    },
  },
}))

export default (props: ItemProps) => {
  const { user, template, title } = props;
  const classes = useStyles();
  const [askLoginOpen, setAskLoginOpen] = React.useState(false);
  const [newWorkspaceOpen, setNewWorkspaceOpen] = React.useState(false);
  const [showAddFilesToWorkspaceDialog, setShowAddFilesToWorkspaceDialog] = React.useState(false);
  const [repositoryLoading, setRepositoryLoading] = React.useState(false);
  const [selectedRepository, setRepository] = React.useState<OSBRepository>(null);
  const [repositories, setRepositories] = React.useState<OSBRepository[]>(null);
  const [checked, setChecked] = React.useState<RepositoryResourceNode[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);

  const workspaceTypeUndefined = typeof WORKSPACE_TEMPLATES[template] === 'undefined';
  const handlePageChange = (event: React.ChangeEvent<unknown>, pageNumber: number) => {
    setPage(pageNumber);
  }

  React.useEffect(() => {
    if (workspaceTypeUndefined){
      RepositoryService.getRepositoriesDetails(page).then((reposDetails) => {
        setRepositories(reposDetails.osbrepositories);
        setTotalPages(reposDetails.pagination.numberOfPages);
      });
    }
  }, [page]);

  const loadRepository = (repositoryId: number) => {
    setRepositoryLoading(true);
    RepositoryService.getRepository(repositoryId).then((repo) => {
      setRepository(repo);
    });
  }
  const closeAddFilesToWorkspaceDialog = () => {
    setShowAddFilesToWorkspaceDialog(false);
    setRepository(null);
  }

  const setCheckedArray = (newChecked: RepositoryResourceNode[]) => {
    setChecked(newChecked);
  }

  const handleClick = () => {
    if (!user) {
      setAskLoginOpen(true);
    } else {
      if (workspaceTypeUndefined){
        setChecked([]);
        setRepositoryLoading(false);
        setShowAddFilesToWorkspaceDialog(true);
      }
      else{
        setNewWorkspaceOpen(true);
      }
    }
  };

  const handleContinue = () => {
    console.log(checked);
  }

  const handleChipDelete = (key: string) => {
    const checkedChips = checked.filter(item => item.resource.path !== key);
    setChecked(checkedChips);
  }

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

  if (workspaceTypeUndefined){
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
        <OSBChipList chipItems={checked} onDeleteChip={(chipPath: string) => handleChipDelete(chipPath)} />
        <WorkspaceEdit workspace={defaultWorkspace} onLoadWorkspace={closeNewWorkspace} />
      </OSBDialog>
      <OSBDialog
        title="Create new workspace"
        open={showAddFilesToWorkspaceDialog}
        closeAction={closeAddFilesToWorkspaceDialog}
      >
        {
          repositoryLoading ?
          selectedRepository ?
          <>
            <Box className={classes.resourceBrowser}>
              <RepositoryResourceBrowser repository={selectedRepository} checkedChanged={setCheckedArray} backAction={handleBackAction}/>
            </Box>
            <Grid container={true} className={classes.info}>
              <Grid item={true}>
                <Typography component="h6" className={classes.helperDialogText}>
                  Please select the files to add to your new workspace
                </Typography>
              </Grid>
              <Grid item={true}>
                <Button variant="contained" onClick={handleContinue}>Continue</Button>
              </Grid>
            </Grid>
        </>
          :
          <CircularProgress size={40}
            style={{
              position: 'relative',
              left: '45%',
              margin: '10px',
            }}
          />
          : repositories ?
          <>
            <Box className={classes.repositoriesList}>
              <Repositories repositories={repositories} handleRepositoryClick={(repositoryId: number) => loadRepository(repositoryId)} showSimpleVersion={true} />
              <Typography component="h6" className={classes.helperDialogText}>Please select a repository</Typography>
            </Box>
            {totalPages > 1 ? <OSBPagination totalPages={totalPages} handlePageChange={handlePageChange} color="primary" showFirstButton={true} showLastButton={true} /> :
            null
            }
          </>
          : <CircularProgress size={40}
              style={{
                position: 'relative',
                left: '45%',
                margin: '10px',
              }}
            />
        }
      </OSBDialog>
    </>
  );
};