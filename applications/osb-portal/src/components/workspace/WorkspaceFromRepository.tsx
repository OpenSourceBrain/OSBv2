import * as React from "react";
import { useSelector } from "react-redux";
import makeStyles from "@mui/styles/makeStyles";
import { Typography, Box, Button, Grid, CircularProgress } from "@mui/material";

import { RepositoriesList as Repositories } from "../repository/RespositoriesTable";
import { WorkspaceEditor } from "../index";
import RepositoryResourceBrowser from "../repository/RepositoryResourceBrowser";
import OSBChipList from "../common/OSBChipList";
import OSBPagination from "../common/OSBPagination";
import {
  OSBRepository,
  RepositoryResourceNode,
} from "../../apiclient/workspaces";
import RepositoryService from "../../service/RepositoryService";
import WorkspaceService from "../../service/WorkspaceService";
import { Workspace, OSBApplication } from "../../types/workspace";
import OSBDialog from "../common/OSBDialog";
import { fontColor, bgInputs, radius, bgLight, bgDarker } from "../../theme";
import { RootState } from "../../store/rootReducer";
import RepositoriesWorkspacesSearchField from "../common/RepositoriesWorkspacesSearchField";
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

const useStyles = makeStyles((theme) => ({
  helperDialogText: {
    padding: `0px ${theme.spacing(1)} ${theme.spacing(1)}`,
    fontSize: "0.9rem",
  },
  info: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(2),
    "& .MuiTypography-root": {
      paddingLeft: 0,
    },
  },
  repositoriesList: {
    "& .scrollbar": {
      borderBottomRightRadius: radius,
      borderBottomLeftRadius: radius,
    },
    "& .MuiBox-root": {
      maxHeight: "500px",
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(0),
      "& .MuiGrid-container": {
        backgroundColor: bgLight,
        "& .col": {
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginBottom: 0,
          "& .tag": {
            marginTop: 0,
            marginBottom: 0,
          },
        },
        "&:hover": {
          backgroundColor: bgDarker,
        },
      },
    },
  },
  resourceBrowser: {
    overflow: "hidden",
    borderRadius: radius,
    margin: theme.spacing(2),
    "& .scrollbar": {
      overflow: "auto",
      maxHeight: "295px",
      "& .MuiList-root": {
        paddingRight: "1rem",
        marginTop: 0,
        "& .MuiListItem-root": {
          alignItems: "baseline",
        },
        "& p": {
          fontSize: "0.8rem",
          color: fontColor,
          "& span": {
            fontSize: "0.8rem",
            color: bgInputs,
          },
          "& .icon": {
            width: "2rem",
            display: "flex",
            "& .MuiSvgIcon-root": {
              height: "1rem",
            },
          },
        },
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: bgInputs,
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
      },
    },
    "& .flex-grow-1": {
      width: "100%",
    },
    "& .MuiTextField-root": {
      width: "96%",
      marginRight: "2%",
      marginLeft: "2%",
      padding: "0.6rem",
    },
  },
}));

export const WorkspaceFromRepository = ({
  close,
  workspaceCreatedCallback,
  closeMainDialog,
}: {
  close: () => any;
    workspaceCreatedCallback: (refresh?: boolean, workspace?: Workspace) => void;
    closeMainDialog?: (isClosed: boolean) => void;
}) => {
  const [checked, setChecked] = React.useState<RepositoryResourceNode[]>([]);

  const user = useSelector((state: RootState) => state.user);
  const classes = useStyles();
  const [selectedRepository, setSelectedRepository] =
    React.useState<OSBRepository>(null);

  enum Stage {
    SELECT_REPO,
    SELECT_FILES,
    EDIT_WORKSPACE,
    ERROR_NO_FILES,
    SHOW_SUCCESS_OR_ERROR_MESSAGE,
  }
  const [stage, setStage] = React.useState(Stage.SELECT_REPO);

  const [createdWorkspaceConfirmationContent, setCreatedWorkspaceConfirmationContent] = React.useState({
    title: "",
    content: "",
    isSuccess: false,
    showConfirmationDialog: true,
  });
  const [workspaceLink, setWorkspaceLink] = React.useState("");

  const handleBackAction = () => {
    if (stage > Stage.SELECT_REPO) {
      setStage(stage - 1);
      setChecked([]);
    }
  };

  const handleContinue = () => {
    if (stage < Stage.SHOW_SUCCESS_OR_ERROR_MESSAGE) setStage(stage + 1);
  };

  const defaultWorkspace: Workspace = {
    resources: [],
    volume: null,
    shareType: null,
    name: "",
    description: null,
  };

  const handleChipDelete = (key: string) => {
    const checkedChips = checked.filter((item) => item.resource.path !== key);
    setChecked(checkedChips);
  };

  const onWorkspaceCreated = (refresh = false, ws: Workspace) => {
    if (checked.length > 0) {
      WorkspaceService.importResourcesToWorkspace(
        ws.id,
        checked.map((c) => c.resource)
      ).then(() => {
        setWorkspaceLink(`/workspaces/${ws.id}`);
        setCreatedWorkspaceConfirmationContent((prevContent) => ({
          ...prevContent,
          title: "Success!",
          content: "New workspace created.",
          isSuccess: true,
        }));
        setStage(Stage.SHOW_SUCCESS_OR_ERROR_MESSAGE);
      }).catch((err) => {
        setCreatedWorkspaceConfirmationContent((prevContent) => ({
          ...prevContent,
          title: "Error!",
          content: "Unexpected error submitting the workspace. Please try again later.",
          isSuccess: false,
        }));
        setStage(Stage.SHOW_SUCCESS_OR_ERROR_MESSAGE);
      });
    } else {
      setStage(Stage.ERROR_NO_FILES)
      workspaceCreatedCallback(refresh, ws);
    }
  };

  const SelectFilesFromRepository = ({ repositoryId }: any) => {
    let checkedIn: RepositoryResourceNode[] = [];
    const [repository, setRepository] = React.useState<OSBRepository>(null);
    React.useEffect(() => {
      RepositoryService.getRepository(repositoryId).then((repo) => {
        setRepository(repo);
      });
    }, []);
    const setCheckedArray = (newChecked: RepositoryResourceNode[]) => {
      checkedIn = newChecked;
    };
    return repository ? (
      <>
        <Box className={classes.resourceBrowser}>
          <RepositoryResourceBrowser
            repository={repository}
            checkedChanged={setCheckedArray}
            backAction={handleBackAction}
          />
        </Box>
        <Grid container={true} className={classes.info}>
          <Grid item={true}>
            <Typography component="h6" className={classes.helperDialogText}>
              Please select the files to add to your new workspace
            </Typography>
          </Grid>
          <Grid item={true}>
            <Button
              variant="contained"
              onClick={() => {
                handleContinue();
                setChecked(checkedIn);
              }}
            >
              Continue
            </Button>
          </Grid>
        </Grid>
      </>
    ) : (
      <CircularProgress
        size={40}
        style={{
          position: "relative",
          left: "45%",
          margin: "10px",
        }}
      />
    );
  };

  const SelectRepository = () => {
    const [repositories, setRepositories] =
      React.useState<OSBRepository[]>(null);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(0);
    const [filter, setFilter] = React.useState("");

    const handlePageChange = (
      event: React.ChangeEvent<unknown>,
      pageNumber: number
    ) => {
      setPage(pageNumber);
    };
    React.useEffect(() => {
      RepositoryService.getRepositoriesDetails(page).then((reposDetails) => {
        setRepositories(reposDetails.osbrepositories);
        setTotalPages(reposDetails.pagination.numberOfPages);
      });
    }, []);

    React.useEffect(() => {
      if (page !== 1) {
        setPage(1);
      } else {
        RepositoryService.getRepositoriesByFilter(page, { text: filter }).then(
          (repos) => {
            setRepositories(repos.osbrepositories);
            setTotalPages(repos.pagination.numberOfPages);
          }
        );
      }
    }, [filter]);

    React.useEffect(() => {
      RepositoryService.getRepositoriesByFilter(page, { text: filter }).then(
        (repos) => {
          setRepositories(repos.osbrepositories);
          setTotalPages(repos.pagination.numberOfPages);
        }
      );
    }, [page]);

    return repositories ? (
      <>
        <Box width={1} className="verticalFit">
          <Grid
            container={true}
            alignItems="center"
            className="verticalFill"
            spacing={1}
          >
            <Grid item={true} xs={12} className="verticalFill">
              <RepositoriesWorkspacesSearchField
                borderRadius={5}
                filterChanged={setFilter}
              />
            </Grid>
            <Grid item={true} xs={12} className="verticalFill">
              <Box
                sx={{
                  width: "100%",
                  maxHeight: "375px",
                  overflow: "scroll",
                  "&::-webkit-scrollbar": {
                    width: 2,
                    height: 2,
                  },
                  "& .MuiTable-root": {
                    tableLayout: 'fixed'
                  },
                  "& .MuiTypography-h5": {
                    wordWrap: 'break-word'
                  }
                }}
              >
                <Repositories
                  repositories={repositories}
                  compact={true}
                  handleRepositoryClick={(repository) => {
                    setSelectedRepository(repository);
                    setStage(Stage.SELECT_FILES);
                  }}
                />
              </Box>
            </Grid>
            {totalPages > 1 ? (
              <Grid item={true} xs={12} className="verticalFill">
                <OSBPagination
                  page={page}
                  count={totalPages}
                  onChange={handlePageChange}
                  showFirstButton={true}
                  showLastButton={true}
                  removeTopBorder={true}
                />
              </Grid>
            ) : null}
          </Grid>
        </Box>
      </>
    ) : (
      <CircularProgress
        size={40}
        style={{
          position: "relative",
          left: "45%",
          margin: "10px",
        }}
      />
    );
  };

  const handleClose = () => {
    setStage(Stage.SELECT_REPO);
    close();
  };

  const handleCloseConfirmationDialog = () => {
    if (createdWorkspaceConfirmationContent.isSuccess) { workspaceCreatedCallback(true, null) }
    setCreatedWorkspaceConfirmationContent({
      title: "",
      content: "",
      isSuccess: false,
      showConfirmationDialog: false,
    });
    Stage ? setStage(Stage.SHOW_SUCCESS_OR_ERROR_MESSAGE + 1) : null
    closeMainDialog(false);
  }

  const returnDialoged = (children: any) => {
    return (
      <OSBDialog
        title="Create new workspace"
        open={true}
        maxWidth={"xl"}
        closeAction={handleClose}
      >
        {children}
      </OSBDialog>
    );
  };

  switch (stage) {
    case Stage.SELECT_REPO:
      return returnDialoged(<SelectRepository />);
    case Stage.SELECT_FILES:
      return returnDialoged(
        <SelectFilesFromRepository repositoryId={selectedRepository.id} />
      );
    case Stage.EDIT_WORKSPACE:
      return (
        <>
          <WorkspaceEditor
            title={"Create new workspace"}
            open={true}
            workspace={{
              ...defaultWorkspace,
              name: selectedRepository.name,
              tags: selectedRepository.tags,
            }}
            onLoadWorkspace={onWorkspaceCreated}
            closeHandler={handleClose}
            user={user}
          >
            {checked.length > 0 && (
              <OSBChipList
                chipItems={checked}
                onDeleteChip={(chipPath: string) => handleChipDelete(chipPath)}
              />
            )}
          </WorkspaceEditor>
        </>
      );
    case Stage.ERROR_NO_FILES:
      return returnDialoged(
        <Grid container={true} className={classes.info}>
          <Grid item={true}>
            <Typography component="h6" className={classes.helperDialogText}>
              No files from this repository have been selected, and so all the
              files in the repository will be added in the workspace. Press OK
              to proceed, or press Cancel and go back and select some.
            </Typography>
          </Grid>
          <Grid item={true}>
            <Button
              color="primary"
              onClick={() => setStage(Stage.SELECT_FILES)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setStage(Stage.EDIT_WORKSPACE)}
            >
              OK
            </Button>
          </Grid>
        </Grid>
      );
    case Stage.SHOW_SUCCESS_OR_ERROR_MESSAGE:

      return (
        <WorkspaceConfirmDialog
          setChecked={setChecked}
          createdWorkspaceConfirmationContent={createdWorkspaceConfirmationContent}
          workspaceLink={workspaceLink}
          handleCloseConfirmationDialog={handleCloseConfirmationDialog}
        />
      )

    default:
      return null;
  }
};

export default WorkspaceFromRepository;
