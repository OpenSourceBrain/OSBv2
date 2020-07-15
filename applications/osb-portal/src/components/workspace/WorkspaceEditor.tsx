import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import MarkdownIt from "markdown-it";
import Dropzone from 'react-dropzone'
import "react-markdown-editor-lite/lib/index.css";
import PublishIcon from '@material-ui/icons/Publish';
import { workspacesApi } from "../../middleware/osbbackend";
import { WorkspacePostRequest } from "../../apiclient/workspaces/apis/RestApi";
import * as modelWorkspace from "../../apiclient/workspaces/models/Workspace";

interface WorkspaceEditProps {
  workspace: modelWorkspace.Workspace;
  onLoadWorkspace: (workspace: modelWorkspace.Workspace) => void;
}

const style = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  borderWidth: 1,
  width : "100%",
  height : "100%",
  borderRadius: 1,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  color: '#bdbdbd'
};


export default (props: WorkspaceEditProps) => {
  const mdParser = new MarkdownIt(/* Markdown-it options */);
  const [workspaceForm, setWorkspaceForm] = React.useState<
    modelWorkspace.Workspace
  >({ ...props.workspace });

  const renderMarkdown = (text: string) => {
    return mdParser.render(text);
  };

  const handleCreateWorkspace = async () => {
    const newWorkspace: modelWorkspace.Workspace = workspaceForm;

    const wspr: WorkspacePostRequest = { workspace: newWorkspace };
    await workspacesApi.workspacePost(wspr).then((workspace) => {
      if (workspace && workspace.id) {
        // TODO: if not workspace or no id raise an error
        props.onLoadWorkspace(workspace);
      }
    });
  };

  const setNameField = (e: any) =>
    setWorkspaceForm({ ...workspaceForm, name: e.target.value });
  const setDescriptionField = (e: any) =>
    setWorkspaceForm({ ...workspaceForm, description: e.target.value });
  const setThumbnail = (e: any) =>
    setWorkspaceForm({ ...workspaceForm, thumbnail: e[0].name });
  return (
    <>
      <Grid container={true} justify="flex-start">
        <Grid item={true} xs={6} >
          <form noValidate={true} autoComplete="off">
            <Box component="div" m={2} ml={0}>
              <TextField
                id="workspaceName"
                label="Name"
                fullWidth={true}
                onChange={setNameField}
                variant="outlined"
              />
            </Box>
            <Box component="div" m={2} ml={0}>
              <TextField
                id="workspaceDescription"
                label="Description"
                multiline={true}
                rows={5}
                fullWidth={true}
                onChange={setDescriptionField}
                variant="outlined"
              />
            </Box>
            <Box component="div" m={2} ml={0}>
              <Button variant="contained" onClick={handleCreateWorkspace}>
                Create
              </Button>
            </Box>
          </form>
        </Grid>
        <Grid item={true} xs={6}>
          <Dropzone onDrop={acceptedFiles => { setThumbnail(acceptedFiles) }}>
            {({getRootProps, getInputProps, acceptedFiles}) => (
              <section>
                <div {...getRootProps({style})}>
                  <input {...getInputProps()} />
                  { acceptedFiles.length === 0 ?
                    <Grid container={true} justify="center" alignItems="center" direction="row">
                      <Grid item={true}>
                        <PublishIcon/>
                      </Grid>
                      <Grid item={true}>
                        <Box component="div" m={1}>
                          <Typography variant="subtitle1" component="p">
                            Upload workspace preview image
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    :
                    <Grid container={true} justify="center" alignItems="center" direction="row">
                      <Grid item={true}>
                        <Typography variant="subtitle1" component="p">
                          Thumbnail File Uploaded:
                        </Typography>
                      </Grid>
                      <Grid item={true}>
                        <Box component="div" m={1}>
                          <Typography variant="subtitle1" component="p">
                            {acceptedFiles[0].name}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  }
                </div>
              </section>
          )}
          </Dropzone>
        </Grid>
      </Grid>
    </>
  );
};
