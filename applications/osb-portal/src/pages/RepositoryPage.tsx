import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";

//theme
import { styled } from "@mui/styles";
import {
  linkColor,
  paragraph,
  secondaryColor as white,
  chipBg,
  bgDarkest,
} from "../theme";

//components
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import { EditRepoDialog, PageSider } from "../components";
import RepositoryPageBanner from "../components/repository/RepositoryPageBanner";
import RepositoryPageDetails from "../components/repository/RepositoryPageDetails";
import { WorkspaceEditor, NewWorkspaceAskUser } from "../components";
import OSBDialog from "../components/common/OSBDialog";
import OSBChipList from "../components/common/OSBChipList";
import {
  ExistingWorkspaceEditor as ExistingWorkspaceSelector,
  ExistingWorkspaceEditorActions,
} from "../components/workspace/ExistingWorkspaceSelector";
import RepositoryActionsMenu from "../components/repository/RepositoryActionsMenu";
import WorkspaceConfirmDialog from "../components/dialogs/WorkspaceConfirmDialog";

//types
import {
  OSBRepository,
  RepositoryResourceNode,
  RepositoryType,
} from "../apiclient/workspaces";
import { UserInfo } from "../types/user";

//icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import RepositoryService from "../service/RepositoryService";
import { Workspace } from "../types/workspace";
import WorkspaceService from "../service/WorkspaceService";
import { canEditRepository } from "../service/UserService";
import { Alert } from "@mui/material";

const GoBackButton = styled(Button)(({ theme }) => ({
  padding: 0,
  color: paragraph,
  fontSize: "0.857rem",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

const AddSelectionButton = styled(Button)(({ theme }) => ({
  color: white,
  fontSize: "0.857rem",
  textTransform: "none",
  borderRadius: "0.429rem",
  border: `0.071rem solid ${white}`,
  height: "100%",

  "&:hover": {
    border: `0.071rem solid ${white}`,
    backgroundColor: "transparent",
  },
}));

const NewWorkspaceButton = styled(Button)(({ theme }) => ({
  background: linkColor,
  border: `0.071rem solid #000`,
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  borderRadius: "0.429rem",
  textTransform: "none",
  height: "100%",
}));


const defaultWorkspace: Workspace = {
  resources: [],
  volume: null,
  shareType: null,
  name: "",
  description: null,
  user: null,
};

export const RepositoryPage = (props: any) => {
  const user: UserInfo = props.user;

  const { repositoryId } = useParams<{ repositoryId: string }>();
  const navigate = useNavigate();
  const [repository, setRepository] = React.useState<OSBRepository>(null);
  const [showWorkspaceEditor, setShowWorkspaceEditor] = React.useState(false);
  const [showExistingWorkspaceEditor, setShowExisitngWorkspaceEditor] =
    React.useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<Workspace>();
  const [showUserNotLoggedInAlert, setShowUserNotLoggedInAlert] =
    React.useState(false);
  const [checked, setChecked] = React.useState<RepositoryResourceNode[]>([]);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const [workspaceLink, setWorkspaceLink] = React.useState(null);
  const [error, setError] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [resetChecked, setResetChecked] = React.useState<boolean>(false);

  const canEdit = canEditRepository(props.user, props.repository);
  const [createdWorkspaceConfirmationContent, setCreatedWorkspaceConfirmationContent] = React.useState({
    title: "",
    content: "",
    showConfirmationDialog: false,
    isSuccess: false,
  })

  if (error) {
    throw error;
  }

  const openDialog = () => {
    setShowWorkspaceEditor(!showWorkspaceEditor);
    if (showWorkspaceEditor) {
      setChecked([]);
      setRefresh(!refresh);
      setResetChecked(true);
    }
  };

  const openExistingWorkspaceDialog = () => {
    setShowExisitngWorkspaceEditor(!showExistingWorkspaceEditor);
    if (showExistingWorkspaceEditor) {
      setChecked([]);
      setRefresh(!refresh);
      setResetChecked(true);
    }
  };

  const confirmAction = (dialogTitle: string, dialogContent: string, isSuccess: boolean) => {
    setCreatedWorkspaceConfirmationContent({
      title: dialogTitle,
      content: dialogContent,
      showConfirmationDialog: true,
      isSuccess: isSuccess,
    })
  };

  const setCheckedChips = (newChecked: RepositoryResourceNode[]) => {
    setChecked(newChecked);
  };

  const handleChipDelete = (key: string) => {
    const checkedChips = checked.filter((item) => item.resource.path !== key);
    setCheckedChips(checkedChips);
    setRefresh(!refresh);
  };

  const getDefaultWorkspaceName = () => {
    if (checked.length === 1) {
      return (
        checked[0].resource.name.substring(
          0,
          checked[0].resource.name.lastIndexOf(".")
        ) || checked[0].resource.name
      );
    } else {
      return repository?.name;
    }
  };

  const handleCloseConfirmationDialog = () => {
    setCreatedWorkspaceConfirmationContent((prevContent) => ({
      ...prevContent,
      showConfirmationDialog: false,
      title: "",
      content: "",
      isSuccess: false,
    }));
  }
  const onWorkspaceCreated = (reload: boolean, ws: Workspace) => {
    const toImport = checked.length ? checked : [repository.contextResources];
    WorkspaceService.importResourcesToWorkspace(
      ws.id,
      toImport.map((c) => c.resource)
    )
      .then(() => {
        setShowWorkspaceEditor(false);
        setWorkspaceLink(`/workspaces/${ws.id}`);
        confirmAction("Success", "New workspace created!", true);
      })
      .catch((e) => {
        setShowWorkspaceEditor(false);
        confirmAction(
          "Error",
          "There was an error creating the new workspace.",
          false
        );
      });
    setRefresh(!refresh);
    setChecked([]);
  };

  const setWorkspace = (ws: Workspace) => {
    setSelectedWorkspace(ws);
  };

  const addToExistingWorkspace = () => {
    setLoading(true);
    const toImport = checked.length ? checked : [repository.contextResources];
    WorkspaceService.importResourcesToWorkspace(
      selectedWorkspace.id,
      toImport.map((c) => c.resource)
    )
      .then(() => {
        setSelectedWorkspace(null);
        confirmAction("Success", "Resources added to workspace!", true);
        setWorkspaceLink(`/workspaces/${selectedWorkspace.id}`);
        setLoading(false);
        setShowExisitngWorkspaceEditor(false);
      })
      .catch((e) => {
        confirmAction(
          "Error",
          "There was an error adding the resources to the workspace",
          false
        );
        setLoading(false);
        setShowExisitngWorkspaceEditor(false);
      });
    setRefresh(!refresh);
    setChecked([]);
  };

  const openRepoUrl = () => {
    switch (repository.repositoryType) {
      // For github, the URL is: repo/tree/branch
      case "github":
        window.open(
          `${repository.uri + "/tree/" + repository.defaultContext}`,
          "_blank"
        );
        break;
      // For dandi, the URL is: repo/version
      case "dandi":
        window.open(
          `${repository.uri + "/" + repository.defaultContext}`,
          "_blank"
        );
        break;
      // For figshare, there does not seem to be a version specific URL
      case "figshare":
        window.open(`${repository.uri}`, "_blank");
        break;
      // Biomodels: repo.version
      case "biomodels":
        window.open(
          `${repository.uri + "." + repository.defaultContext}`,
          "_blank"
        );
        break;
      default:
        window.open(`#`, "_blank");
    }
  };

  const canAddToWorkspace = () => {
    return (
      repository && (repository?.repositoryType !== RepositoryType.Dandi || checked.length > 0)
    );
  };

  React.useEffect(() => {
    setIsLoading(true);
    RepositoryService.getRepository(+repositoryId).then(
      (repo) => {
        setRepository(repo);
        setIsLoading(false);
      },
      (e) => {
        setError(e);
      }
    );
  }, []);

  return (
    <>
      {/*header*/}
      <Box
        sx={{
          px: 4,
          py: 2,
          width: "100%",
          backgroundColor: bgDarkest,
        }}
      >
        <Stack
          spacing={2}
          direction="row"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <GoBackButton
              variant="text"
              startIcon={<ChevronLeftIcon />}
              onClick={() => navigate("/repositories")}
            >
              All repositories
            </GoBackButton>
          </Box>
        
          <Stack spacing={2} direction="row">
            <Tooltip
              title={
                !canAddToWorkspace()
                  ? "Note: due to the large size of files in most DANDI repositories, the default behaviour of adding all files to a new workspace when no files/folders are selected below is disabled. Please select specific files/folders to add to a workspace, bearing in mind the total size of the files."
                  : ""
              }
            >
              <Stack sx={{ width: "100%", padding: 0 }}>
                <AddSelectionButton
                  fullWidth
                  variant="outlined"
                  disableElevation={true}
                  id="add-existing-workspace-button"
                  disabled={!canAddToWorkspace()}
                  color="secondary"
                  sx={{
                    whiteSpace: {
                      lg: "nowrap",
                    },
                  }}
                  onClick={() => {
                    user
                      ? openExistingWorkspaceDialog()
                      : setShowUserNotLoggedInAlert(true);
                  }}
                >
                  Add selection to existing workspace
                </AddSelectionButton>
              </Stack>
            </Tooltip>

            {(
              <Tooltip
                title={
                  !canAddToWorkspace()
                    ? "Note: due to the large size of files in most DANDI repositories, the default behaviour of adding all files to a new workspace when no files/folders are selected below is disabled. Please select specific files/folders to add to a workspace, bearing in mind the total size of the files."
                    : ""
                }
              >
                <Stack sx={{ width: "100%", padding: 0 }}>
                  <NewWorkspaceButton
                    fullWidth
                    variant="contained"
                    disableElevation={true}
                    color="primary"
                    id="create-new-workspace-button"
                    disabled={!canAddToWorkspace()}
                    onClick={() => {
                      user ? openDialog() : setShowUserNotLoggedInAlert(true);
                    }}
                  >
                    New workspace from selection
                  </NewWorkspaceButton>
                </Stack>
              </Tooltip>
            )}
            {canEdit ? (
              <RepositoryActionsMenu
                user={user}
                repository={repository}
                isRepositoryPage={true}
                onAction={(r: OSBRepository) =>
                  r && setRepository({ ...repository, ...r })
                }
              />
            ) : null}
          </Stack>
        </Stack>
      </Box>
      {/*details*/}
      {isLoading && !repository ? (
        <CircularProgress
          size={48}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: -24,
            marginLeft: -24,
          }}
        />
      ) : (
        <>
          <RepositoryPageBanner
            repository={repository}
            openRepoUrl={openRepoUrl}
          />
          <RepositoryPageDetails
            repository={repository}
            openRepoUrl={openRepoUrl}
            checkedChanged={setCheckedChips}
            onAction={(r: OSBRepository) =>
              r && setRepository({ ...repository, ...r })
            }
            user={user}
            resetChecked={resetChecked}
            setResetChecked={setResetChecked}
          />
        </>
      )}

      {/*
       * Here we must use `&& showWorkspaceEditor` so that the
       * `WorkspaceEditor` component is rendered afresh each time. If we don't
       * do this, the states in the `WorkspaceEditor` component like
       * `workspaceForm` are initialised only once with the value of
       * `workspace` prop---at the initial render---and then do not track the
       * value of the `workpace` prop.
       */}

      {user && showWorkspaceEditor && (
        <WorkspaceEditor
          title={"Create new workspace"}
          open={showWorkspaceEditor}
          workspace={{ ...defaultWorkspace, name: getDefaultWorkspaceName(), tags: repository?.tags }}
          onLoadWorkspace={onWorkspaceCreated}
          closeHandler={openDialog}
          filesSelected={checked.length > 0}
          user={user}
        >
          {checked.length > 0 && (
            <OSBChipList
              chipItems={checked}
              onDeleteChip={(chipPath: string) => handleChipDelete(chipPath)}
            />
          )}
        </WorkspaceEditor>
      )}
      {user && (
        <OSBDialog
          title="Add to existing workspace"
          open={showExistingWorkspaceEditor}
          closeAction={openExistingWorkspaceDialog}
          maxWidth="xl"
          actions={
            <ExistingWorkspaceEditorActions
              disabled={!selectedWorkspace || loading}
              closeAction={openExistingWorkspaceDialog}
              onAddClick={addToExistingWorkspace}
            />
          }
        >
          {checked.length > 0 && (
            <div>
              <OSBChipList
                chipItems={checked}
                onDeleteChip={(chipPath: string) => handleChipDelete(chipPath)}
              />
              <Alert
                severity="warning"
                style={{ marginBottom: "1rem" }}
              >
                Please note that adding a file when a file with the same name already exists will overwrite the previous version of the file in the workspace.
              </Alert>
            </div>
          )}
          <ExistingWorkspaceSelector
            setWorkspace={(ws: Workspace) => setWorkspace(ws)}
            loading={loading}
          />
        </OSBDialog>
      )}

      <OSBDialog
        title="Please login or sign up"
        open={showUserNotLoggedInAlert}
        closeAction={() => setShowUserNotLoggedInAlert(false)}
      >
        <NewWorkspaceAskUser />
      </OSBDialog>

      {/* Confirm to user if workspace creation/modification was successful */}
      { createdWorkspaceConfirmationContent.showConfirmationDialog && <WorkspaceConfirmDialog
        setChecked={setChecked}
        createdWorkspaceConfirmationContent={createdWorkspaceConfirmationContent}
        workspaceLink={workspaceLink}
        handleCloseConfirmationDialog={handleCloseConfirmationDialog}
      /> }
    </>
  );
};
export default RepositoryPage;
