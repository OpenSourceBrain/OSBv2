import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dropzone from 'react-dropzone'
import PublishIcon from '@material-ui/icons/Publish';
import ClearIcon from "@material-ui/icons/Clear";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { fade } from '@material-ui/core/styles/colorManipulator';

import { radius, gutter } from '../../theme';
import workspaceService from '../../service/WorkspaceService'
import { Workspace } from '../../types/workspace';

import {
  bgLight,
  primaryColor,
  bgInputs,
  fontColor,
  paragraph,
  bgLightestShade,
} from "../../theme";

const MAX_ALLOWED_THUMBNAIL_SIZE = 1024 * 1024; // 1MB

interface WorkspaceEditProps {
  workspace: Workspace;
  onLoadWorkspace: (refresh?: boolean) => void;
}

const dropAreaStyle = (error: any) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  borderWidth: 1,
  borderRadius: radius,
  padding: gutter,
  borderColor: error ? "red" : fade('#ffffff', 0.42),
  borderStyle: 'dashed',
});

async function readFile(file: Blob) {
  return new Promise((resolve, reject) => {
    const fileReader: FileReader = new FileReader();

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = reject;

    fileReader.readAsArrayBuffer(file);
  })
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-root.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        boxShadow: "0px 0px 0px 3px rgba(55, 171, 200, 0.12)",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: bgLight,
    },
    "& .MuiSelect-selectMenu": {
      backgroundColor: bgLight,
    },
    "& .MuiSvgIcon-root": {
      color: paragraph,
    },
    "& .input-group": {
      marginBottom: theme.spacing(2),
      "& .wrap": {
        [theme.breakpoints.up("sm")]: {
          display: "flex",
        },
      },
      "& .MuiTextField-root": {
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
      },
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
      "& .MuiTypography-root": {
        display: "block",
        fontWeight: "bold",
        fontSize: ".875rem",
        marginBottom: theme.spacing(1),
        color: bgInputs,
      },
      "& .MuiFormControl-root": {
        "&:not(.MuiTextField-root)": {
          width: "9rem",
          flexShrink: 0,
          [theme.breakpoints.down("sm")]: {
            width: "100%",
            marginBottom: ".5rem",
          },
        },
      },
    },
    "& .MuiDialogContent-root": {
      padding: theme.spacing(3),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(3),
      backgroundColor: bgLight,
      "& .MuiButton-root": {
        height: "2.13rem",
        padding: "0 1rem",
        "&.MuiButton-containedPrimary": {
          color: fontColor,
          "&:hover": {
            color: primaryColor,
          },
        },
      },
    },

    "& .MuiDialog-paper": {
      backgroundColor: bgLightestShade,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: bgLight,
      boxShadow: "0 10px 60px rgba(0, 0, 0, 0.5);",
    },

    "& .MuiDialogTitle-root": {
      border: "none",
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
      borderBottomColor: bgLight,
      padding: theme.spacing(3),
      "& .MuiTypography-root": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: 700,
        "& .MuiSvgIcon-root": {
          cursor: "pointer",
        },
      },
    },
  },
}));


let thumbnail: Blob;

export default (props: WorkspaceEditProps) => {

  const { workspace } = props;
  const [workspaceForm, setWorkspaceForm] = React.useState<
    Workspace
  >({ ...props.workspace });


  const [thumbnailPreview, setThumbnailPreview] = React.useState<any>(workspace?.thumbnail);
  const [thumbnailError, setThumbnailError] = React.useState<any>(null);

  const [openDialog, setOpenDialog] = React.useState<boolean>(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const classes = useStyles();

  const handleCreateWorkspace = async () => {
    setLoading(true)
    workspaceService.createOrUpdateWorkspace({ ...workspace, ...workspaceForm }).then(
      async (returnedWorkspace) => {
        if (thumbnail && !thumbnailError) {
          const fileThumbnail: any = await readFile(thumbnail);
          workspaceService.updateWorkspaceThumbnail(returnedWorkspace.id, new Blob([fileThumbnail]))
            .then(() => props.onLoadWorkspace(true),
              e => console.error('Error uploading thumbnail', e)
            );
        } else {
          setLoading(true)
          props.onLoadWorkspace(true)
        }
      }
      , (e) => {
        setLoading(false);
        throw new Error('Error submitting the workspace')
        // console.error('Error submitting the workspace', e);
      }

    );

  }



  const previewFile = (file: Blob) => {
    if (!file) {
      setThumbnailError(null);
      setThumbnailPreview(null);
      return;
    }

    if (!file.type.includes("image")) {
      setThumbnailError("Not an image file");
      return;
    }
    if (file.size > MAX_ALLOWED_THUMBNAIL_SIZE) {
      setThumbnailError("File exceeds allowed size (1MB)");
      return;
    }

    setThumbnailError(null)

    const fileReader: FileReader = new FileReader();

    fileReader.onload = () => {
      setThumbnailPreview(fileReader.result);
    };

    fileReader.readAsDataURL(file);

  }

  const setNameField = (e: any) =>
    setWorkspaceForm({ ...workspaceForm, name: e.target.value });
  const setDescriptionField = (e: any) =>
    setWorkspaceForm({ ...workspaceForm, description: e.target.value });
  const setThumbnail = (uploadedThumbnail: any) => {
    thumbnail = uploadedThumbnail;
    previewFile(thumbnail);
  }
  const [loading, setLoading] = React.useState(false);
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      className={classes.root}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
      {workspace.id ? "" : "Create a new workspace"}
        <ClearIcon onClick={handleCloseDialog}/>
      </DialogTitle>
      <DialogContent>
      <Grid container={true} spacing={2} justify="flex-start" alignItems="stretch">
        <Grid item={true} xs={12} >
          <Grid container={true} spacing={2} direction="column">
            <Grid item={true}>
              <TextField
                id="workspaceName"
                label="Name"
                fullWidth={true}
                onChange={setNameField}
                variant="outlined"
                defaultValue={workspace?.name}
              />
            </Grid>
            <Grid item={true}>
              <TextField
                id="workspaceDescription"
                label="Description"
                multiline={true}
                rows={5}
                fullWidth={true}
                onChange={setDescriptionField}
                variant="outlined"
                defaultValue={workspace?.description}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item={true} xs={12} alignItems="stretch">
          <Dropzone onDrop={(acceptedFiles: any) => { setThumbnail(acceptedFiles[0]) }}>
            {({ getRootProps, getInputProps, acceptedFiles }: { getRootProps: (p: any) => any, getInputProps: () => any, acceptedFiles: any[] }) => (
              <section style={{ display: 'flex', alignItems: 'stretch', backgroundImage: !thumbnailError && `url(${thumbnailPreview})`, backgroundSize: 'cover', flex: 1 }}>
                <div {...getRootProps({ style: dropAreaStyle(thumbnailError) })}>
                  <input {...getInputProps()} />
                  <Grid container={true} justify="center" alignItems="center" direction="row">
                    <Grid item={true}>
                      {/* <IconButton><PublishIcon /></IconButton> */}
                      {acceptedFiles.length === 0 ? '' :
                        <IconButton
                          onClick={(e: any) => {
                            e.preventDefault();
                            setThumbnail(null)
                          }
                          }
                        >
                          <DeleteForeverIcon />
                        </IconButton>}
                    </Grid>
                    <Grid item={true} >
                      <Box component="div" m={1}>
                        <Typography variant="subtitle2" component="p">
                          {acceptedFiles.length === 0 ?
                            "Drop file here to upload..."
                            :
                            null
                          }
                        </Typography>
                        <Button variant="outlined">
                          Browse files
                        </Button>
                        {
                          thumbnailError &&
                          <Typography color="error" variant="subtitle2" component="p">
                            {
                              thumbnailError
                            }
                          </Typography>
                        }
                      </Box>
                    </Grid>
                  </Grid>
                </div>
              </section>
            )}
          </Dropzone>
        </Grid>
      </Grid>
      </DialogContent>
      <DialogActions>
        <Grid item={true}>
          <Grid container={true} spacing={2} justify="space-between">
            <Grid item={true}>
            <Button disabled={loading} onClick={handleCloseDialog} color="primary">
                {"Cancel"}
              </Button>
              <Button variant="contained" disabled={loading} onClick={handleCreateWorkspace} color="primary">
                {workspace.id ? "Save" : "Create New Workspace"}
              </Button>
              {loading &&
                <CircularProgress
                  size={24}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: -12,
                    marginLeft: -12,
                  }}
                />}
              </Grid>
          </Grid>
        </Grid>
      </DialogActions>
      
    </Dialog>
  );
};
