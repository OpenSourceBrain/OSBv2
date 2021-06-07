import * as React from "react";
import { useParams, useHistory } from "react-router-dom";
import ReactMarkdown from "react-markdown";

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

import { OSBRepository, RepositoryResourceNode } from "../apiclient/workspaces";
import RepositoryService from "../service/RepositoryService";

import RepositoryResourceBrowser from "../components/repository/RepositoryResourceBrowser";
import OSBDialog from '../components/common/OSBDialog';
import WorkspaceEditor from "../components/workspace/WorkspaceEditor";
import OSBChipList from "../components/common/OSBChipList";
import { ExistingWorkspaceEditor, ExistingWorkspaceEditorActions } from "../components/workspace/ExistingWorkspaceEditor";
import { Workspace } from "../types/workspace";

import {
  bgRegular,
  linkColor,
  primaryColor,
  bgLightest,
  fontColor,
  bgDarkest,
  checkBoxColor,
  paragraph,
  bgLightestShade,
  bgInputs,
  font,
  bgLight,
  bgDarker,
  radius,
} from "../theme";
import WorkspaceService from "../service/WorkspaceService";
import { DialogContent, DialogTitle } from "@material-ui/core";



const useStyles = makeStyles((theme) => ({
  gitHubLinkButton: {
    position: 'relative',
    float: 'right',
    top: '-5px',
    borderRadius: 0,
    backgroundColor: 'black',
    textTransform: 'none',
    alignItems: 'center',
    "& .MuiButton-label": {
      color: 'white',
      fontSize: '0.6rem',
    },
    "&:hover": {
      "& .MuiButton-label": {
        color: 'black',
      },
      "& .MuiButton-endIcon": {
        color: 'black',
      },
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
    "& .scrollbar": {
      paddingRight: 0,
      marginTop: theme.spacing(2),
      height: '100%',
    },
    "& .main-content": {
      padding: theme.spacing(3),
      height: '83vh',
      alignItems: 'stretch',
      "& .MuiGrid-container": {
        height: '100%',
        alignItems: 'stretch',
        "& .MuiGrid-item": {
          height: '100%',
        },
      },
      "& .MuiTextField-root": {
        borderRadius: 4,
        marginTop: theme.spacing(2),
        backgroundColor: bgLightestShade,
        padding: theme.spacing(2),
        "& .MuiSvgIcon-root": {
          width: "1.25rem",
          borderRadius: 0,
          color: paragraph,
          height: "auto",
        },
        "& .MuiInput-root": {
          "&:before": {
            display: "none",
          },
          "&:after": {
            display: "none",
          },
        },
        "& .MuiInputBase-input": {
          padding: theme.spacing(0),
          fontSize: ".88rem",
        },
      },
      "& .MuiListItemIcon-root": {
        minWidth: 1,
      },
      "& .MuiListItemText-root": {
        margin: 0,
      },
      "& .MuiList-root": {
        padding: 0,
        marginTop: theme.spacing(0),
        "& .flex-grow-1": {
          borderBottom: `1px solid ${bgRegular}`,
          borderTop: `1px solid ${bgRegular}`,
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
          marginLeft: theme.spacing(2),
        },
        "& p": {
          fontSize: ".913rem",
          display: "flex",
          alignItems: "flex-end",
          color: fontColor,
          "& span": {
            fontSize: ".913rem",
            color: bgInputs,
          },
        },
        "& strong": {
          fontSize: ".793rem",
          fontWeight: "bold",
          color: bgInputs,
        },
        "& .icon": {
          width: "2rem",
          display: "flex",
          "&.file": {
            "& .MuiSvgIcon-root": {
              color: bgInputs,
            },
          },
          "& .MuiSvgIcon-root": {
            color: linkColor,
          },
        },
        "& .MuiAvatar-root": {
          width: "1.5rem",
          borderRadius: 0,
          height: "auto",
        },
        "& .MuiIconButton-root": {
          margin: 0,
          padding: 0,
        },
        "& .MuiListItem-root": {
          borderRadius: 4,
          padding: 0,
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
          "&:first-child": {
            "& .flex-grow-1": {
              borderTop: 0,
            },
          },
          "&:last-child": {
            "& .flex-grow-1": {
              borderBottomWidth: 2,
            },
          },
          "&:hover": {
            backgroundColor: bgLightest,
          },
        },
      },
      "& .MuiBreadcrumbs-ol": {
        lineHeight: 1,
        "& .MuiAvatar-root": {
          width: "auto",
          borderRadius: 0,
          height: "auto",
        },
        "& .MuiBreadcrumbs-separator": {
          fontSize: ".693rem",
          lineHeight: 1,
          color: paragraph,
          fontWeight: "bold",
        },
        "& .MuiBreadcrumbs-li": {
          lineHeight: 1,
          "& .MuiTypography-root": {
            fontSize: ".693rem",
            fontWeight: "bold",
            color: paragraph,
            lineHeight: 1,
          },
          "& .MuiLink-root": {
            fontSize: ".693rem",
            lineHeight: 1,
            fontWeight: "bold",
            display: "block",
            color: bgInputs,
            cursor: "pointer",
          },
        },
      },
      "& .flex-grow-1": {
        flexGrow: 1,
      },
      "& .preview-box": {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        boxShadow: '0px 0px 0px 3px rgba(0, 0, 0, 0.25)',
        borderRadius: radius,
        fontFamily: font,
        overflow: "auto",
        flexGrow: 1,
        "& a": {
          color: linkColor,
          textDecoration: 'none',
          "&:hover": {
            textDecoration: 'underline',
          },
        },
        "& pre": {
          padding: theme.spacing(2),
          backgroundColor: bgLightestShade,
          borderRadius: radius,
        },
        "& h1": {
          fontWeight: 'normal',
        },
        "& h2": {
          marginTop: theme.spacing(5),
          fontWeight: '500',
          paddingBottom: '5px',
        },
        "& h1, h2": {
          borderBottom: `1px solid ${bgRegular}`,
        },
        "& p": {
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: 'normal',
          fontSize: '0.8rem',
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: 'transparent',
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: '#c4c4c4',
        },
        "& p a img": {
          maxWidth: '25vw',
        },
      },
      "& .primary-heading": {
        borderBottom: `3px solid ${bgInputs}`,
        fontSize: ".88rem",
        fontWeight: "bold",
        marginBottom: theme.spacing(2),
        lineHeight: "1.25rem",
        paddingBottom: theme.spacing(1),
      },
    },
    "& .subheader": {
      display: "flex",
      background: bgLightest,
      alignItems: "center",
      height: "4.062rem",
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
      "& .MuiButton-contained": {
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
  },
  resourceBrowserContainer: {
    maxHeight: '100%',
    overflow: 'auto',
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: bgInputs,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: 'transparent',
    },
    "& .MuiBox-root": {
      overflow: 'initial',
      height: 'fit-content',
    },
  },
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

export const RepositoryPage = () => {
  const { repositoryId } = useParams<{ repositoryId: string }>();
  const history = useHistory();
  const [repository, setRepository] = React.useState<OSBRepository>();
  const [showWorkspaceEditor, setShowWorkspaceEditor] = React.useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = React.useState(false);
  const [showExistingWorkspaceEditor, setShowExisitngWorkspaceEditor] = React.useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<Workspace>();
  const [checked, setChecked] = React.useState<RepositoryResourceNode[]>([]);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);

  const classes = useStyles();

  React.useEffect(() => {
    RepositoryService.getRepository(+repositoryId).then((repo) => {

      setRepository(repo);
    })
  }, [])

  const openDialog = () => {
    setShowWorkspaceEditor(!showWorkspaceEditor);
    if (showWorkspaceEditor){
      setChecked([]);
      setRefresh(!refresh);
    }
  }

  const openExisitngWorkspaceDialog = () => {
    setShowExisitngWorkspaceEditor(!showExistingWorkspaceEditor);
    if (showExistingWorkspaceEditor){
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
      confirmAction("Success", "New workspace created!");
    }).catch((error) => {
      setShowWorkspaceEditor(false);
      confirmAction("Error", "There was an error creating the new workspace.");
    });
    setRefresh(!refresh);
    setChecked([]);
  }

  const setWorkspace = (ws: Workspace) => {
    console.log('selectedWorkspace', ws);
    setSelectedWorkspace(ws);
  }

  const addToExistingWorkspace = () => {
    setLoading(true);
    const toImport = checked.length ? checked : [repository.contextResources];
    WorkspaceService.importResourcesToWorkspace(selectedWorkspace.id, toImport.map(c => c.resource)).then(() => {
      setSelectedWorkspace(null);
      confirmAction("Success", "Resources added to workspace!");
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
      <Box className={classes.root}>
        <Box className="subheader" paddingX={3} justifyContent="space-between">
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
            <Button variant="outlined" disableElevation={true} color="secondary" style={{borderColor: 'white'}} onClick={openExisitngWorkspaceDialog}>
              Add to existing workspace
            </Button>
            <Button variant="contained" disableElevation={true} color="primary" onClick={openDialog}>
              <AddIcon />
              Create new workspace
            </Button>
          </Box>
        </Box>

        <Box className="main-content">
          {repository ?
            <Grid container={true} className="row" spacing={5}>
              <Grid item={true} xs={12} md={6}>
                <Box className="flex-grow-1">
                  <a href={repository.uri} target="_blank" rel="noreferrer">
                    <Button className={classes.gitHubLinkButton} variant="contained" size="small" endIcon={<LinkIcon />}>
                      See on GitHub
                    </Button>
                  </a>
                  <Typography component="h3" className="primary-heading">
                    README
                  </Typography>
                  <Box className="preview-box scrollbar">
                    <ReactMarkdown skipHtml={true}>
                      {repository.description}
                    </ReactMarkdown>
                  </Box>
                </Box>
              </Grid>
              <Grid item={true} xs={12} md={6}>
                <Box className="flex-grow-1">
                  <Typography component="h3" className="primary-heading">
                    Resources
                  </Typography>

                  <Box className={`${classes.resourceBrowserContainer} scrollbar`}>
                    <RepositoryResourceBrowser repository={repository} checkedChanged={setCheckedChips} refresh={refresh}/>
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
      <Box className={classes.root}>
        <OSBDialog title="Create a new workspace" open={showWorkspaceEditor} closeAction={openDialog} >
          {checked.length > 0 && <OSBChipList chipItems={checked} onDeleteChip={(chipPath: string) => handleChipDelete(chipPath)} />}

          <WorkspaceEditor workspace={{ ...defaultWorkspace, name: getDefaultWorkspaceName() }} onLoadWorkspace={onWorkspaceCreated} closeHandler={openDialog} />
        </OSBDialog>
      </Box>

      {/* Confirm to user if workspace creation was successful */}
      {
        showConfirmationDialog && <Dialog open={showConfirmationDialog}
          onClose={() => setShowConfirmationDialog(false)}>
          <DialogTitle>{confirmationDialogTitle}</DialogTitle>
          <DialogContent>{confirmationDialogContent}</DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => { setChecked([]); setShowConfirmationDialog(false) }}>OK</Button>
          </DialogActions>
        </Dialog>
      }
      <OSBDialog title="Add to exisitng workspace" open={showExistingWorkspaceEditor} closeAction={openExisitngWorkspaceDialog} actions={<ExistingWorkspaceEditorActions disabled={!selectedWorkspace || loading} closeAction={openExisitngWorkspaceDialog} onAddClick={addToExistingWorkspace}/>}>
        {checked.length > 0 &&
          <OSBChipList chipItems={checked} onDeleteChip={(chipPath: string) => handleChipDelete(chipPath)} />
        }
        <ExistingWorkspaceEditor setWorkspace={(ws: Workspace) => setWorkspace(ws)} loading={loading}/>
      </OSBDialog>
    </>
  );
};

export default RepositoryPage;
