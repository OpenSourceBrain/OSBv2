import * as React from "react";
import { useParams, useHistory } from "react-router-dom";

import makeStyles from '@mui/styles/makeStyles';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import LinkIcon from "@mui/icons-material/Link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "@mui/material/Link";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  Chip,
  DialogContent,
  DialogTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import {
  OSBRepository,
  RepositoryResourceNode,
  RepositoryContentType,
  RepositoryType,
} from "../apiclient/workspaces";
import RepositoryService from "../service/RepositoryService";
import RepositoryResourceBrowser from "../components/repository/RepositoryResourceBrowser";
import OSBDialog from "../components/common/OSBDialog";
import { WorkspaceEditor, MainMenu } from "../components";
import OSBChipList from "../components/common/OSBChipList";
import { NewWorkspaceAskUser } from "../components";
import {
  ExistingWorkspaceEditor as ExistingWorkspaceSelector,
  ExistingWorkspaceEditorActions,
} from "../components/workspace/ExistingWorkspaceSelector";
import { Workspace } from "../types/workspace";
import WorkspaceService from "../service/WorkspaceService";
import { UserInfo } from "../types/user";
import MarkdownViewer from "../components/common/MarkdownViewer";
import RepositoryActionsMenu from "../components/repository/RepositoryActionsMenu";
import Resources from "../components/repository/resources";

import {
  linkColor,
  bgLightest,
  fontColor,
  bgDarkest,
  checkBoxColor,
  paragraph,
  textColor,
} from "../theme";
import { CodeBranchIcon } from "../components/icons";

const useStyles = makeStyles((theme) => ({
  infoIcon: {
    fontSize: "small",
    verticalAlign: "middle",
    color: paragraph,
  },
  linkButton: {
    position: "absolute",
    right: 0,
    backgroundColor: "black",
    textTransform: "none",
    "& .MuiButton-label": {
      color: "white",
      fontSize: "0.7rem",
    },
    "&:hover": {
      backgroundColor: "black",
    },
  },
  previewBox: {
    padding: theme.spacing(3),
    border: `3px solid #1e1e1e`,
    backgroundColor: "#191919",
    minHeight: 300,
  },
  repositoryResourceBrowserBox: {
    width: "100%",
  },
  repositoryInformation: {
    marginBottom: theme.spacing(1),
    "& .MuiAccordionSummary-root": {
      flexDirection: "row",
      paddingLeft: `${theme.spacing(1)} !important`,
    },
    "& .MuiAccordionDetails-root": {
      paddingLeft: `${theme.spacing(2)} !important`,
      paddingBottom: theme.spacing(1),
    },
    "& .MuiChip-root": {
      margin: `5px 5px ${theme.spacing(1)} 0px`,
      backgroundColor: "#3c3c3c",
      color: paragraph,
      textTransform: "capitalize",
    },
    "& .repo-chip": {
      color: textColor,
      textTransform: "none",
    },
  },
  root: {
    maxHeight: "100%",
    backgroundColor: bgDarkest,
    "& .MuiCheckbox-colorSecondary": {
      color: checkBoxColor,
      "&.Mui-checked": {
        color: linkColor,
      },
    },
    "& .main-content": {
      padding: theme.spacing(3),
      "& .MuiGrid-container": {
        height: `calc(100% + ${theme.spacing(5)})`,
      },
      "& .flex-grow-1": {
        flexGrow: 1,
      },
    },
    "& .subheader": {
      display: "flex",
      background: bgLightest,
      alignItems: "center",
      height: "4.062rem",
      paddingRight: 0,
      justifyContent: "space-between",
      "& .MuiSvgIcon-root": {
        width: "1rem",
        marginRight: theme.spacing(1),
        height: "auto",
        cursor: "pointer",
      },

      "& h1": {
        fontSize: ".88rem",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        "& span": {
          fontSize: ".88rem",
          lineHeight: 1,
          fontWeight: "bold",
          "&:not(:last-child)": {
            cursor: "pointer",
            fontWeight: "normal",
            marginRight: ".5rem",
            "&:after": {
              content: '"/"',
              display: "inline-block",
              paddingLeft: ".5rem",
            },
          },
          "&:first-of-type": {
            color: fontColor,
          },
        },
      },
      "& .MuiButton-outlined, .MuiButton-containedPrimary": {
        [theme.breakpoints.down('sm')]: {
          paddingLeft: 0,
          paddingRight: 0,
        },
        [theme.breakpoints.down('md')]: {
          minWidth: "2.25rem",
        },
        [theme.breakpoints.up("sm")]: {
          minWidth: "11.5rem",
          "& .MuiSvgIcon-root": {
            display: "none",
          },
        },
        "& .MuiButton-label": {
          color: fontColor,
          [theme.breakpoints.down('sm')]: {
            fontSize: 0,
          },
        },
      },
    },
  },
}));

const defaultWorkspace: Workspace = {
  resources: [],
  volume: null,
  shareType: null,
  name: "",
  description: null,
  user: null,
};

let confirmationDialogTitle = "";
let confirmationDialogContent = "";

export const RepositoryPage = (props: any) => {
  const user: UserInfo = props.user;

  const { repositoryId } = useParams<{ repositoryId: string }>();
  const history = useHistory();
  const [repository, setRepository] = React.useState<OSBRepository>(null);
  const [showWorkspaceEditor, setShowWorkspaceEditor] = React.useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] =
    React.useState(false);
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

  const classes = useStyles();

  React.useEffect(() => {
    RepositoryService.getRepository(+repositoryId).then(
      (repo) => {
        setRepository(repo);
      },
      (e) => {
        setError(e);
      }
    );
  }, []);

  if (error) {
    throw error;
  }

  const openDialog = () => {
    setShowWorkspaceEditor(!showWorkspaceEditor);
    if (showWorkspaceEditor) {
      setChecked([]);
      setRefresh(!refresh);
    }
  };

  const openExistingWorkspaceDialog = () => {
    setShowExisitngWorkspaceEditor(!showExistingWorkspaceEditor);
    if (showExistingWorkspaceEditor) {
      setChecked([]);
      setRefresh(!refresh);
    }
  };

  const confirmAction = (dialogTitle: string, dialogContent: string) => {
    confirmationDialogTitle = dialogTitle;
    confirmationDialogContent = dialogContent;
    setShowConfirmationDialog(true);
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

  const onWorkspaceCreated = (reload: boolean, ws: Workspace) => {
    const toImport = checked.length ? checked : [repository.contextResources];
    WorkspaceService.importResourcesToWorkspace(
      ws.id,
      toImport.map((c) => c.resource)
    )
      .then(() => {
        setShowWorkspaceEditor(false);
        setWorkspaceLink(`/workspace/${ws.id}`);
        confirmAction("Success", "New workspace created!");
      })
      .catch((e) => {
        setShowWorkspaceEditor(false);
        confirmAction(
          "Error",
          "There was an error creating the new workspace."
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
        confirmAction("Success", "Resources added to workspace!");
        setWorkspaceLink(`/workspace/${selectedWorkspace.id}`);
        setLoading(false);
        setShowExisitngWorkspaceEditor(false);
      })
      .catch((e) => {
        confirmAction(
          "Error",
          "There was an error adding the resources to the workspace"
        );
        setLoading(false);
        setShowExisitngWorkspaceEditor(false);
      });
    setRefresh(!refresh);
    setChecked([]);
  };

  const getRepoURL = () => {
    switch (repository.repositoryType) {
      // For github, the URL is: repo/tree/branch
      case "github":
        return repository.uri + "/tree/" + repository.defaultContext;
      // For dandi, the URL is: repo/version
      case "dandi":
        return repository.uri + "/" + repository.defaultContext;
      // For figshare, there does not seem to be a version specific URL
      case "figshare":
        return repository.uri;
      default:
        return "#";
    }
  };

  const canAddToWorkspace = () => {
    return (
      repository?.repositoryType !== RepositoryType.Dandi || checked.length > 0
    );
  };

  return <>
    <MainMenu />
    <Box className={`${classes.root} verticalFit`}>
      <Box className="subheader" paddingX={3} justifyContent="space-between">
        <Box>
          <Box display="flex" alignItems="center">
            <ArrowBackIcon onClick={() => history.push("/repositories")} />
            <Typography component="h1" color="primary">
              <Typography
                component="span"
                onClick={() => history.push("/repositories")}
              >
                All repositories
              </Typography>
              {repository ? (
                <Typography component="span">{repository.name}</Typography>
              ) : null}
            </Typography>
          </Box>
        </Box>

        <Tooltip
          title={
            !canAddToWorkspace()
              ? "Note: due to the large size of files in most DANDI repositories, the default behaviour of adding all files to a new workspace when no files/folders are selected below is disabled. Please select specific files/folders to add to a workspace, bearing in mind the total size of the files."
              : ""
          }
        >
          <Box>
            <Button
              id="add-existing-workspace-button"
              variant="outlined"
              disabled={!canAddToWorkspace()}
              disableElevation={true}
              color="secondary"
              style={{ borderColor: "white" }}
              onClick={() => {
                user
                  ? openExistingWorkspaceDialog()
                  : setShowUserNotLoggedInAlert(true);
              }}
            >
              <AddIcon />
              Add to existing workspace
            </Button>
            <Button
              id="create-new-workspace-button"
              variant="contained"
              disabled={!canAddToWorkspace()}
              disableElevation={true}
              color="primary"
              onClick={() => {
                user ? openDialog() : setShowUserNotLoggedInAlert(true);
              }}
            >
              <AddIcon />
              Create new workspace
            </Button>
            <RepositoryActionsMenu
              user={user}
              repository={repository}
              onAction={(r: OSBRepository) =>
                r && setRepository({ ...repository, ...r })
              }
            />
          </Box>
        </Tooltip>
      </Box>

      <Box className="main-content verticalFit">
        {repository ? (
          <Grid container={true} spacing={5} className="verticalFill">
            <Grid item={true} xs={12} md={6} className="verticalFill">
              <Box
                className="flex-grow-1 scrollbar"
                maxWidth="100%"
                position="relative"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    component="h2"
                    variant="h2"
                    className="primary-heading"
                    style={{ width: "100%" }}
                  >
                    Overview{" "}
                    <Tooltip
                      title={
                        <>
                          Repositories provide views of files in public
                          resources that have been indexed in OSBv2 by users.
                          Use the Repository Contents pane on the right to
                          select files from this repository to add to your
                          workspaces.{" "}
                          <Link
                            href="https://docs.opensourcebrain.org/OSBv2/Repositories.html"
                            target="_blank"
                            underline="hover">
                            Learn more...
                          </Link>
                        </>
                      }
                    >
                      <InfoOutlinedIcon className={classes.infoIcon} />
                    </Tooltip>
                  </Typography>
                </Box>
                <Box className={classes.repositoryInformation}>
                  <Typography component="h1" variant="h1">
                    {repository.name}
                  </Typography>
                  {repository.user &&
                    (repository.user.firstName ||
                      repository.user.lastName) && (
                      <Typography component="p" variant="body2">
                        Added by{" "}
                        {
                          <Link href={`/user/${repository?.user?.id}`} underline="hover">
                            {" "}
                            {repository.user.firstName +
                              " " +
                              repository.user.lastName}
                          </Link>
                        }{" "}
                        {repository.timestampCreated &&
                          ` on ${repository.timestampCreated.toDateString()}`}
                      </Typography>
                    )}
                  {repository.summary && (
                    <Typography component="p" variant="body2">
                      <MarkdownViewer text={repository.summary} />
                    </Typography>
                  )}
                  <Box>
                    {repository.contentTypesList.map((type) => {
                      return (
                        <Chip
                          className="repo-chip"
                          size="small"
                          avatar={
                            <FiberManualRecordIcon
                              color={
                                type === RepositoryContentType.Experimental
                                  ? "primary"
                                  : "secondary"
                              }
                            />
                          }
                          key={type}
                          label={type}
                        />
                      );
                    })}
                    {repository.defaultContext && (
                      <Chip
                        className="repo-chip"
                        size="small"
                        avatar={<CodeBranchIcon />}
                        label={repository.defaultContext}
                        key={repository.defaultContext}
                      />
                    )}
                    {repository.tags.map((tagObject) => {
                      return (
                        <Chip
                          className="repo-chip"
                          size="small"
                          label={tagObject.tag}
                          key={tagObject.id}
                        />
                      );
                    })}
                  </Box>

                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography component="p" variant="body1">
                        More Info
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {repository.id && (
                        <Typography component="p" variant="body2">
                          Id: {repository.id}
                        </Typography>
                      )}
                      <Typography component="p" variant="body2">
                        Repository type:{" "}
                        {repository.repositoryType.charAt(0).toUpperCase() +
                          repository.repositoryType.slice(1)}
                      </Typography>
                      {repository.defaultContext && (
                        <Typography component="p" variant="body2">
                          Context: {repository.defaultContext}
                        </Typography>
                      )}
                      {repository.timestampCreated && (
                        <Typography component="p" variant="body2">
                          Created:{" "}
                          {repository.timestampCreated.toDateString()}
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Box>
                <Box position="relative" mt="2">
                  <Button
                    href={getRepoURL()}
                    target="_blank"
                    className={classes.linkButton}
                    variant="contained"
                    size="small"
                    endIcon={<LinkIcon />}
                  >
                    View on{" "}
                    {Resources[repository.repositoryType] ||
                      repository.repositoryType}
                  </Button>
                  <Typography
                    component="h2"
                    variant="h2"
                    className="primary-heading"
                  >
                    Repository preview
                  </Typography>
                  <Paper className={`verticalFit ${classes.previewBox}`}>
                    <MarkdownViewer
                      text={repository.description}
                      repository={repository}
                    />
                  </Paper>
                </Box>
              </Box>
            </Grid>
            <Grid item={true} xs={12} md={6} className="verticalFill">
              <Box
                className={`verticalFit ${classes.repositoryResourceBrowserBox}`}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    component="h2"
                    variant="h2"
                    style={{ width: "100%" }}
                  >
                    Repository contents{" "}
                    <Tooltip
                      title={
                        <>
                          {`The file list below shows the latest (current) version and contents of the repository. Select files and folders below to add to your workspaces. To see the previous version and contents of the repository, please view the repository on ${
                            Resources[repository.repositoryType] ||
                            repository.repositoryType
                          }.`}{" "}
                          <Link
                            href="https://docs.opensourcebrain.org/OSBv2/Repositories.html"
                            target="_blank"
                            underline="hover">
                            Learn more...
                          </Link>
                        </>
                      }
                    >
                      <InfoOutlinedIcon className={classes.infoIcon} />
                    </Tooltip>
                  </Typography>
                </Box>
                <Box className="verticalFit">
                  <RepositoryResourceBrowser
                    repository={repository}
                    checkedChanged={setCheckedChips}
                    refresh={refresh}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
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
        )}
      </Box>
    </Box>

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
        workspace={{ ...defaultWorkspace, name: getDefaultWorkspaceName(), tags: repository.tags }}
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
        actions={
          <ExistingWorkspaceEditorActions
            disabled={!selectedWorkspace || loading}
            closeAction={openExistingWorkspaceDialog}
            onAddClick={addToExistingWorkspace}
          />
        }
      >
        {checked.length > 0 && (
          <OSBChipList
            chipItems={checked}
            onDeleteChip={(chipPath: string) => handleChipDelete(chipPath)}
          />
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
    {showConfirmationDialog && (
      <Dialog
        open={showConfirmationDialog}
        onClose={() => setShowConfirmationDialog(false)}
      >
        <DialogTitle>{confirmationDialogTitle}</DialogTitle>
        <DialogContent>{confirmationDialogContent}</DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              setChecked([]);
              setShowConfirmationDialog(false);
            }}
          >
            Close
          </Button>
          {workspaceLink && (
            <Button color="primary" variant="contained">
              <Link
                href={workspaceLink}
                target="_blank"
                color="secondary"
                underline="none"
              >
                Go to workspace
              </Link>
            </Button>
          )}
        </DialogActions>
      </Dialog>
    )}
  </>;
};

export default RepositoryPage;
