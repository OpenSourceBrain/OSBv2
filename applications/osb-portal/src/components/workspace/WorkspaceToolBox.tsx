import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, Paper } from "@material-ui/core";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import Button from "@material-ui/core/Button";
import AppsOutlinedIcon from "@material-ui/icons/AppsOutlined";
import InsertChartOutlinedIcon from "@material-ui/icons/InsertChartOutlined";
import CodeOutlinedIcon from "@material-ui/icons/CodeOutlined";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText, {
  DialogContentTextTypeMap,
} from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

import { UserInfo } from "../../types/user";

import { workspacesApi } from "../../middleware/osbbackend";
import { WorkspacePostRequest } from "../../apiclient/workspaces/apis/RestApi";
import * as modelWorkspace from "../../apiclient/workspaces/models/Workspace";

const useStyles = makeStyles((theme) => ({
  iconButton: {
    width: 24,
    height: 24,
    padding: 0,
  },
  svgIcon: {
    paddingTop: 6,
    paddingLeft: 4,
  },
  dialogContent: {
    paddingBottom: 16,
  },
  dialogContentText: {
    maxWidth: "75%",
  },
  dialogTextField: {},
  dialogButtons: {
    paddingRight: 0,
  },

}));

const mdParser = new MarkdownIt(/* Markdown-it options */);

export const WorkspaceToolBox = (props: any) => {
  const classes = useStyles();

  const user: UserInfo = props.user;
  const keycloak = props.keycloak;

  let type: string = props.type;

  const [show, setShow] = React.useState(false);
  const handleClickOpen = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  const handleUserLogin = () => {
    keycloak.login();
  };
  const handleSignup = () => {
    keycloak.register();
  };

  const createSingleCell = () => {
    type = "1";
    handleClickOpen();
  };

  const [workspaceForm, setWorkspaceForm] = React.useState({
    name: "",
    description: "",
  });
  const updateWorkspaceForm = (e: any) => {
    const field =
      e.constructor.name === "SyntheticEvent" ? "name" : "description";
    const value =
      e.constructor.name === "SyntheticEvent" ? e.target.value : e.text;
    setWorkspaceForm({
      ...workspaceForm,
      [field]: value,
    });
  };
  const renderMarkdown = (text: string) => {
    return mdParser.render(text);
  };

  const handleCreateWorkspace = async () => {
    const newWorkspace: modelWorkspace.Workspace = workspaceForm;

    const wspr: WorkspacePostRequest = { workspace: newWorkspace };
    await workspacesApi.workspacePost(wspr).then((workspace) => {
      if (workspace && workspace.id) {
        // ToDo: if not workspace or no id raise an error
        props.onLoadWorkspaces();
        handleClose();
      }
    });
  };

  let dialogContent = null;
  if (user === undefined || user === null) {
    dialogContent = (
      <>
        <Box
          display="flex"
          justifyContent="flex-start"
          m={0}
          p={0}
          bgcolor="background.paper"
        >
          <Box flexGrow={1}>
            <DialogContentText
              id="new-worspace-in-dialog-text"
              className={classes.dialogContentText}
            >
              To create a new workspace you need a Open Source Brain account. If
              you already have one please sign in, if not create one for free.
              Workspaces will let you save your own models and data, run
              simulations and analysis.
            </DialogContentText>
          </Box>
          <Box>
            <DialogActions className={classes.dialogButtons}>
              <Button onClick={handleSignup}>Sign Up</Button>
              <Button onClick={handleUserLogin} autoFocus={true}>
                Sign In
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </>
    );
  } else {
    dialogContent = (
      <>
        <Box
          display="flex"
          justifyContent="flex-start"
          m={0}
          p={0}
          bgcolor="background.paper"
        >
          <Box flexGrow={1}>
            <TextField
              id="standard-basic"
              label="Name of the workspace"
              fullWidth={true}
              className={classes.dialogTextField}
              onChange={updateWorkspaceForm}
            />
          </Box>
          <Box>
            <DialogActions className={classes.dialogButtons}>
              <Button onClick={handleCreateWorkspace}>Create</Button>
            </DialogActions>
          </Box>
        </Box>
        <MdEditor
          value={workspaceForm.description}
          style={{ height: "500px" }}
          renderHTML={renderMarkdown}
          onChange={updateWorkspaceForm}
        />
      </>
    );
  }

  return (
    <>
      <Dialog
        onClose={handleClose}
        open={show}
        maxWidth={"md"}
        fullWidth={true}
      >
        <DialogTitle id="new-workspace-dialog-title">
          {"Create a new workspace"}
          <IconButton
            aria-label="close"
            className={classes.iconButton}
            onClick={handleClose}
          >
            <SvgIcon className={classes.svgIcon}>
              <path
                d="M12 4.5L4 12.5"
                stroke={"white"}
                strokeWidth={2}
                strokeLinecap={"round"}
                strokeLinejoin={"round"}
              />
              <path
                d="M4 4.5L12 12.5"
                stroke={"white"}
                strokeWidth={2}
                strokeLinecap={"round"}
                strokeLinejoin={"round"}
              />
            </SvgIcon>
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {dialogContent}
        </DialogContent>
      </Dialog>
      <Paper>
        <Typography component="h2" variant="h6" >Create a new Workspace</Typography>
        <Grid container={true} alignItems="center" justify="center" spacing={5}>
          <Grid item={true}  onClick={createSingleCell}>
            <RadioButtonUncheckedIcon fontSize="large" />
            <Typography variant="subtitle1">Single Cell</Typography>
            <Typography variant="caption">NetPyNe</Typography>
          </Grid>
          <Grid item={true} justify="center">
            <AppsOutlinedIcon fontSize="large" />
            <Typography variant="subtitle1">Network</Typography>
            <Typography variant="caption">NetPyNe</Typography>
          </Grid>
          <Grid item={true} >
            <InsertChartOutlinedIcon fontSize="large" />
            <Typography variant="subtitle1">Data Analyses</Typography>
            <Typography variant="caption">NWB Explorer</Typography>
          </Grid>
          <Grid item={true} >
            <CodeOutlinedIcon fontSize="large" />
            <Typography variant="subtitle1">Playground</Typography>
            <Typography variant="caption">Jupyter Lab</Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
