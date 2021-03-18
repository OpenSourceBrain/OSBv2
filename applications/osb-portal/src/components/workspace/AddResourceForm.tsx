import * as React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

import workspaceResourceService, { urlToName } from '../../service/WorkspaceResourceService'
import { Workspace } from '../../types/workspace';
import CircularProgress from '@material-ui/core/CircularProgress';

interface WorkspaceEditProps {
  workspace: Workspace;
  onResourceAdded: () => void;
  onSubmit: () => void;
}

function isValidHttpUrl(s: string) {
  let url;

  try {
    url = new URL(s);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}


export default (props: WorkspaceEditProps) => {

  const { workspace, onResourceAdded } = props;

  const [url, setUrl] = React.useState<string>(null);

  const [name, setName] = React.useState<string>(null);

  const [nameError, setNameError] = React.useState<string>(null);

  const [urlError, setUrlError] = React.useState<string>(null);

  const [waiting, setWaiting] = React.useState(false);

  const handleSetUrl = (e: any) => {
    setUrl(e.target.value);
    setName(urlToName(e.target.value));
  }

  const handleSetName = (e: any) => setName(e.target.value);

  const handleAddResource = () => {
    let error = false;

    for (const resource of workspace.resources) {
      if (resource.name === name) {
        error = true;
        setNameError("A resource already exists with this name");
        break;
      }
    }
    if (!isValidHttpUrl(url)) {
      error = true;
      setUrlError("Insert a valid public http url")
    }
    if (!error) {
      setWaiting(true);
      workspaceResourceService.addResource(workspace, url, name).then(onResourceAdded, () => alert('An error occurred while adding the resource'));
    }

  }

  return (
    <>
      <Grid container={true} spacing={2} justify="flex-start" alignItems="stretch" direction="column">
        <Grid item={true} style={{ flex: 1 }}>
          <TextField
            id="resource-url-input"
            key="input-resource-url"
            error={Boolean(urlError)}
            helperText={urlError}
            label="Paste URL of resource"
            fullWidth={true}
            onChange={handleSetUrl}
            variant="standard"
          />
        </Grid>
        <Grid item={true} style={{ flex: 1 }}>
          <TextField

            key={"namefor-" + url}
            error={Boolean(nameError)}
            helperText={nameError}
            label="Resource name"
            fullWidth={true}
            defaultValue={name}
            onChange={handleSetName}
            variant="standard"
          />
        </Grid>
        <Grid item={true} alignItems="flex-end">
          <Button variant="contained" onClick={handleAddResource} disabled={waiting}>
            Upload
              </Button>
          {waiting &&
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
    </>
  );
};
