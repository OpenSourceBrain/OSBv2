import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dropzone from 'react-dropzone'
import PublishIcon from '@material-ui/icons/Publish';
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
  secondaryColor,
} from "../../theme";

const useStyles = makeStyles((theme) => ({
  actionButton: {
    color: secondaryColor,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  actionBox: {
    width: '100%',
    display: 'flex', 
    flexDirection: 'row-reverse',
    backgroundColor: bgLight,
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
  dropZoneBox: {
    color: bgInputs,
    "& .MuiTypography-subtitle2": {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    "& .MuiButton-outlined": {
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'center',
      color: bgInputs,
      borderRadius: 0,
      border: `3px dashed ${bgInputs}`,
    },
  },
  workspaceThumbnailText: {
    ...theme.typography.h6,
    color: bgInputs,
    fontSize: '0.7rem',
    marginLeft: theme.spacing(1),
  },
}));

const MAX_ALLOWED_THUMBNAIL_SIZE = 1024 * 1024; // 1MB

interface WorkspaceEditProps {
  workspace: Workspace;
  onLoadWorkspace: (refresh?: boolean, workspace?: Workspace) => void;
  closeHandler?: ()=> void;
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

let thumbnail: Blob;

export default (props: WorkspaceEditProps) => {

  const classes = useStyles();

  const { workspace } = props;
  const [workspaceForm, setWorkspaceForm] = React.useState<
    Workspace
  >({ ...props.workspace });

  const closeWorkSpaceEditor = () => {
    if(props.closeHandler){
      props.closeHandler();
    }
  }


  const [thumbnailPreview, setThumbnailPreview] = React.useState<any>(workspace?.thumbnail);
  const [thumbnailError, setThumbnailError] = React.useState<any>(null);

  const handleCreateWorkspace = async () => {
    setLoading(true)
    workspaceService.createOrUpdateWorkspace({ ...workspace, ...workspaceForm }).then(
      async (returnedWorkspace) => {
        if (thumbnail && !thumbnailError) {
          const fileThumbnail: any = await readFile(thumbnail);
          workspaceService.updateWorkspaceThumbnail(returnedWorkspace.id, new Blob([fileThumbnail]))
            .then(() => props.onLoadWorkspace(true, returnedWorkspace),
              e => console.error('Error uploading thumbnail', e)
            );
        } else {
          setLoading(true)
          props.onLoadWorkspace(true, returnedWorkspace)
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
    <>
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
        <Typography component="h6" className={classes.workspaceThumbnailText}>
            Workspace thumbnail
        </Typography>
        <Grid item={true} xs={12} alignItems="stretch">
          <Dropzone onDrop={(acceptedFiles: any) => { setThumbnail(acceptedFiles[0]) }}>
            {({ getRootProps, getInputProps, acceptedFiles }: { getRootProps: (p: any) => any, getInputProps: () => any, acceptedFiles: any[] }) => (
              <section style={{ display: 'flex', alignItems: 'stretch', backgroundImage: !thumbnailError && `url(${thumbnailPreview})`, backgroundSize: 'cover', flex: 1 }}>
                <div {...getRootProps({ style: dropAreaStyle(thumbnailError) })}>
                  <input {...getInputProps()} />
                  <Grid container={true} justify="center" alignItems="center" direction="row">
                    {acceptedFiles.length !== 0 && <Grid item={true}>
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
                    }
                    <Grid item={true} >
                      <Box component="div" m={1} className={classes.dropZoneBox}>
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
        <Box className={classes.actionBox}>
          <Grid item={true}>
              <Grid  container={true} spacing={2} justify="space-between">
                <Grid item={true}>
                <Button disabled={loading} color="primary" onClick={closeWorkSpaceEditor}>
                    Cancel
                  </Button>
                  <Button className={classes.actionButton} variant="contained" color="primary" disabled={loading} onClick={handleCreateWorkspace}>
                    {workspace.id ? "Save" : "Create A New Workspace"}
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
        </Box>
      </Grid>
    </>
  );
};
