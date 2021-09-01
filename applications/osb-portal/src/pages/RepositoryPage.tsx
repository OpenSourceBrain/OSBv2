import * as React from "react";
import { useParams, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import LinkIcon from '@material-ui/icons/Link';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Link from "@material-ui/core/Link";
import { Chip, DialogContent, DialogTitle, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";

import { OSBRepository, RepositoryResourceNode } from "../apiclient/workspaces";
import RepositoryService from "../service/RepositoryService";
import RepositoryResourceBrowser from "../components/repository/RepositoryResourceBrowser";
import OSBDialog from '../components/common/OSBDialog';
import WorkspaceEditor from "../components/workspace/WorkspaceEditor";
import OSBChipList from "../components/common/OSBChipList";
import { NewWorkspaceAskUser } from "../components";
import { ExistingWorkspaceEditor, ExistingWorkspaceEditorActions } from "../components/workspace/ExistingWorkspaceSelector";
import { Workspace } from "../types/workspace";
import WorkspaceService from "../service/WorkspaceService";
import { UserInfo } from "../types/user";
import MarkdownViewer from "../components/common/MarkdownViewer"
import MainMenu from "../components/menu/MainMenu";
import RepositoryActionsMenu from "../components/repository/RepositoryActionsMenu";

import {
  linkColor,
  bgLightest,
  fontColor,
  bgDarkest,
  checkBoxColor,
} from "../theme";


const useStyles = makeStyles((theme) => ({
  linkButton: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'black',
    textTransform: 'none',
    "& .MuiButton-label": {
      color: 'white',
      fontSize: '0.7rem',
    },
    "&:hover": {
      backgroundColor: 'black',
    },
  },
  repositoryResourceBrowserBox: {
    width: '100%',
  },
  repositoryInformation: {
    marginBottom: theme.spacing(1),
    "& .MuiAccordionSummary-root": {
      flexDirection: 'row',
      paddingLeft: `${theme.spacing(1)}px !important`,
    },
    "& .MuiAccordionDetails-root": {
      paddingLeft: `${theme.spacing(2)}px !important`,
      paddingBottom: theme.spacing(1),
    },
    "& .MuiChip-root": {
      marginLeft: '5px',
      marginRight: '5px',
    },
  },
  root: {
    maxHeight: '100%',
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
        height: `calc(100% + ${theme.spacing(5)}px)`
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
          "&:first-child": {
            color: fontColor,
          },
        },
      },
      "& .MuiButton-outlined, .MuiButton-containedPrimary": {
        [theme.breakpoints.down("xs")]: {
          paddingLeft: 0,
          paddingRight: 0,
        },
        [theme.breakpoints.down("sm")]: {
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
          [theme.breakpoints.down("xs")]: {
            fontSize: 0,
          },
        },
      },
    },
  }
}));


const defaultWorkspace: Workspace = {
  resources: [],
  volume: null,
  shareType: null,
  name: "",
  description: null
}

let confirmationDialogTitle = "";
let confirmationDialogContent = "";

export const RepositoryPage = (props: any) => {
  const user: UserInfo = props.user;

  const { repositoryId } = useParams<{ repositoryId: string }>();
  const history = useHistory();
  const [repository, setRepository] = React.useState<OSBRepository>();
  const [showWorkspaceEditor, setShowWorkspaceEditor] = React.useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = React.useState(false);
  const [showExistingWorkspaceEditor, setShowExisitngWorkspaceEditor] = React.useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<Workspace>();
  const [showUserNotLoggedInAlert, setShowUserNotLoggedInAlert] = React.useState(false);
  const [checked, setChecked] = React.useState<RepositoryResourceNode[]>([]);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const [workspaceLink, setWorkspaceLink] = React.useState(null);

  const classes = useStyles();

  React.useEffect(() => {
    RepositoryService.getRepository(+repositoryId).then((repo) => {

      setRepository(repo);
    })
  }, [])

  const openDialog = () => {
    setShowWorkspaceEditor(!showWorkspaceEditor);
    if (showWorkspaceEditor) {
      setChecked([]);
      setRefresh(!refresh);
    }
  }

  const openExistingWorkspaceDialog = () => {
    setShowExisitngWorkspaceEditor(!showExistingWorkspaceEditor);
    if (showExistingWorkspaceEditor) {
      setChecked([]);
      setRefresh(!refresh);
    }
  }

  const confirmAction = (dialogTitle: string, dialogContent: string) => {
    confirmationDialogTitle = dialogTitle;
    confirmationDialogContent = dialogContent;
    setShowConfirmationDialog(true);
  }

  const setCheckedChips = (newChecked: RepositoryResourceNode[]) => {
    setChecked(newChecked);
  }

  const handleChipDelete = (key: string) => {
    const checkedChips = checked.filter(item => item.resource.path !== key);
    setCheckedChips(checkedChips);
    setRefresh(!refresh);
  }

  const getDefaultWorkspaceName = () => {
    if (checked.length === 1) {
      return checked[0].resource.name.substring(0, checked[0].resource.name.lastIndexOf('.')) || checked[0].resource.name;
    }
    else {
      return repository?.name;
    }
  }

  const onWorkspaceCreated = (reload: boolean, ws: Workspace) => {
    const toImport = checked.length ? checked : [repository.contextResources];
    WorkspaceService.importResourcesToWorkspace(ws.id, toImport.map(c => c.resource)).then(() => {
      setShowWorkspaceEditor(false);
      setWorkspaceLink(`/workspace/${ws.id}`);
      confirmAction("Success", "New workspace created!");
    }).catch((error) => {
      setShowWorkspaceEditor(false);
      confirmAction("Error", "There was an error creating the new workspace.");
    });
    setRefresh(!refresh);
    setChecked([]);
  }

  const setWorkspace = (ws: Workspace) => {
    setSelectedWorkspace(ws);
  }

  const addToExistingWorkspace = () => {
    setLoading(true);
    const toImport = checked.length ? checked : [repository.contextResources];
    WorkspaceService.importResourcesToWorkspace(selectedWorkspace.id, toImport.map(c => c.resource)).then(() => {
      setSelectedWorkspace(null);
      confirmAction("Success", "Resources added to workspace!");
      setWorkspaceLink(`/workspace/${selectedWorkspace.id}`);
      setLoading(false);
      setShowExisitngWorkspaceEditor(false);
    }).catch((error) => {
      confirmAction("Error", "There was an error adding the resources to the workspace");
      setLoading(false);
      setShowExisitngWorkspaceEditor(false);
    });
    setRefresh(!refresh);
    setChecked([]);
  }

  return (
    <>
      <MainMenu />
      <Box className={`${classes.root} verticalFit`}>
        <Box className="subheader" paddingX={3} justifyContent="space-between"  >
          <Box>
            <Box display="flex" alignItems="center">
              <ArrowBackIcon onClick={() => history.goBack()} />
              <Typography component="h1" color="primary">
                <Typography component="span" onClick={history.goBack}>All repositories</Typography>
                {repository ? <Typography component="span">{repository.name}</Typography> : null}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Button variant="outlined" disableElevation={true} color="secondary" style={{ borderColor: 'white' }} onClick={() => { user ? openExistingWorkspaceDialog() : setShowUserNotLoggedInAlert(true) }}>
              <AddIcon />
              Add to existing workspace
            </Button>
            <Button variant="contained" disableElevation={true} color="primary" onClick={() => { user ? openDialog() : setShowUserNotLoggedInAlert(true) }}>
              <AddIcon />
              Create new workspace
            </Button>
            <RepositoryActionsMenu user={user} repository={repository} />
          </Box>
        </Box>

        <Box className="main-content verticalFit">
          {repository ?
            <Grid container={true} spacing={5} className="verticalFill">
              <Grid item={true} xs={12} md={6} className="verticalFill">
                <Box className="flex-grow-1 verticalFit" maxWidth="100%" position="relative">
                  <Box>

                    <Button onClick={() => window.open(repository.uri, "_blank")} className={classes.linkButton} variant="contained" size="small" endIcon={<LinkIcon />}>
                      See on {repository.repositoryType}
                    </Button>
                    <Typography component="h2" variant="h2" className="primary-heading">
                      Overview
                    </Typography>
                  </Box>
                  <Box className={classes.repositoryInformation}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography component="p" variant="body1">OSB Repository Information</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {repository.id && <Typography component="p" variant="body2">
                          Id: {repository.id}
                        </Typography>}
                        <Typography component="p" variant="body2">
                          Title: {repository.name}
                        </Typography>
                        {repository.summary && <Typography component="p" variant="body2">
                          Summary: {repository.summary}
                        </Typography>}
                        <Typography component="p" variant="body2">
                          Content type: {repository.contentTypes}
                        </Typography>
                        <Typography component="p" variant="body2">
                          Repository type: {repository.repositoryType.charAt(0).toUpperCase() + repository.repositoryType.slice(1)}
                        </Typography>
                        {repository.defaultContext && <Typography component="p" variant="body2">
                          Context: {repository.defaultContext}
                        </Typography>}
                        {repository.user && (repository.user.firstName || repository.user.lastName) && <Typography component="p" variant="body2">
                          User: {`${repository.user.firstName} ${repository.user.lastName}`}
                        </Typography>}
                        {repository.timestampCreated && <Typography component="p" variant="body2">
                          Created: {repository.timestampCreated.toString()}
                        </Typography>}
                        {repository.timestampUpdated && <Typography component="p" variant="body2">
                          Updated: {repository.timestampUpdated.toString()}
                        </Typography>}
                        {repository.tags && repository.tags.length > 0 && <Box>
                          Tags:
                          {
                            repository.tags.map(tagObject => {
                              return <Chip size="small" label={tagObject.tag} key={tagObject.id} />
                            })
                          }
                        </Box>}
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                  <MarkdownViewer text={repository.description} repository={repository}/>
                </Box>
              </Grid>
              <Grid item={true} xs={12} md={6} className="verticalFill">
                <Box className={`verticalFit ${classes.repositoryResourceBrowserBox}`}>
                  <Typography component="h2" variant="h2">
                    Resources
                  </Typography>
                  <Box className="verticalFit">
                    <RepositoryResourceBrowser repository={repository} checkedChanged={setCheckedChips} refresh={refresh} />
                  </Box>
                </Box>
              </Grid>

            </Grid>
            : (
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

      <OSBDialog title="Create a new workspace" open={showWorkspaceEditor} closeAction={openDialog} >
        {checked.length > 0 && <OSBChipList chipItems={checked} onDeleteChip={(chipPath: string) => handleChipDelete(chipPath)} />}

        <WorkspaceEditor workspace={{ ...defaultWorkspace, name: getDefaultWorkspaceName() }} onLoadWorkspace={onWorkspaceCreated} closeHandler={openDialog} filesSelected={checked.length > 0} />
      </OSBDialog>

      <OSBDialog title="Add to existing workspace" open={showExistingWorkspaceEditor} closeAction={openExistingWorkspaceDialog} actions={<ExistingWorkspaceEditorActions disabled={!selectedWorkspace || loading} closeAction={openExistingWorkspaceDialog} onAddClick={addToExistingWorkspace} />}>
        {checked.length > 0 &&
          <OSBChipList chipItems={checked} onDeleteChip={(chipPath: string) => handleChipDelete(chipPath)} />
        }
        <ExistingWorkspaceEditor setWorkspace={(ws: Workspace) => setWorkspace(ws)} loading={loading} />
      </OSBDialog>

      <OSBDialog title="Please login or sign up" open={showUserNotLoggedInAlert} closeAction={() => setShowUserNotLoggedInAlert(false)}>
        <NewWorkspaceAskUser />
      </OSBDialog>

      {/* Confirm to user if workspace creation/modification was successful */}
      {
        showConfirmationDialog && <Dialog open={showConfirmationDialog}
          onClose={() => setShowConfirmationDialog(false)}>
          <DialogTitle>{confirmationDialogTitle}</DialogTitle>
          <DialogContent>{confirmationDialogContent}</DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => { setChecked([]); setShowConfirmationDialog(false) }}>Close</Button>
            {workspaceLink && <Button color="primary" variant="contained">
              <Link href={workspaceLink} target="_blank" color="secondary" underline="none">
                Go to workspace
              </Link>
            </Button>}
          </DialogActions>
        </Dialog>
      }
    </>
  );
};

export default RepositoryPage;
