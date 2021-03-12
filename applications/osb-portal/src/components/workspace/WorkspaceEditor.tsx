import * as React from "react";
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


interface WorkspaceEditProps {
  workspace: Workspace;
  onLoadWorkspace: (refresh?: boolean) => void;
}

const dropAreaStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  borderWidth: 1,
  borderRadius: radius,
  padding: gutter,
  borderColor: fade('#ffffff', 0.42),
  borderStyle: 'dashed',
};

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

  const [workspaceForm, setWorkspaceForm] = React.useState<
    Workspace
  >({ ...props.workspace });


  const [thumbnailPreview, setThumbnailPreview] = React.useState<any>(null);

  const handleCreateWorkspace = async (publicable: boolean = false) => {
    setLoading(true)
    workspaceService.createWorkspace({ ...workspaceForm, publicable }).then(
      async (workspace) => {
        if (thumbnail) {
          const fileThumbnail: any = await readFile(thumbnail);
          workspaceService.updateWorkspaceThumbnail(workspace.id, new Blob([fileThumbnail])).then(() => props.onLoadWorkspace(true), e => console.error('Error uploading thumbnail'));
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
        <Grid item={true} xs={6} >
          <Grid container={true} spacing={2} direction="column">
            <Grid item={true}>
              <TextField
                id="workspaceName"
                label="Name"
                fullWidth={true}
                onChange={setNameField}
                variant="outlined"
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
              />
            </Grid>
            <Grid item={true}>
              <Grid container={true} spacing={2} justify="space-between">
                <Grid item={true}>
                  <Button variant="contained" disabled={loading} onClick={e => handleCreateWorkspace(false)}>
                    Create
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
          </Grid>
        </Grid>
        <Grid item={true} xs={6} alignItems="stretch" >
          <Dropzone onDrop={(acceptedFiles: any) => { setThumbnail(acceptedFiles[0]) }}>
            {({ getRootProps, getInputProps, acceptedFiles }: { getRootProps: (p: any) => any, getInputProps: () => any, acceptedFiles: any[] }) => (
              <section style={{ display: 'flex', alignItems: 'stretch', backgroundImage: `url(${thumbnailPreview})`, backgroundSize: 'cover', flex: 1 }}>
                <div {...getRootProps({ style: dropAreaStyle })}>
                  <input {...getInputProps()} />
                  <Grid container={true} justify="center" alignItems="center" direction="row">
                    <Grid item={true}>
                      <IconButton><PublishIcon /></IconButton>
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
                            "Upload workspace preview image"
                            :
                            null
                          }
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </div>
              </section>
            )}
          </Dropzone>
        </Grid>
      </Grid>
    </>
  );
};
