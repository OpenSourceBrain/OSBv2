import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import workspaceResourceService, { urlToName } from '../../service/WorkspaceResourceService'
import { Workspace } from '../../types/workspace';

interface WorkspaceEditProps {
  workspace: Workspace;
  onResourceAdded: () => void;
}



export default (props: WorkspaceEditProps) => {

  const { workspace, onResourceAdded } = props;

  const [url, setUrl] = React.useState<string>(null);

  const [name, setName] = React.useState<string>(null);

  const handleSetUrl = (e: any) => {
    setUrl(e.target.value);

    setName(urlToName(e.target.value));


  }

  const handleSetName = (e: any) => setName(e.target.value);

  const handleAddResource = () => {
    workspaceResourceService.addResource(workspace, url, name).then(onResourceAdded, () => alert('An error occurred while adding the resource'));
  }

  return (
    <>
      <Grid container={true} spacing={2} justify="flex-start" alignItems="stretch" direction="column">
        <Grid item={true} style={{ flex: 1 }}>
          <TextField
            key="input-resource-url"
            id="workspaceName"
            label="Paste URL of resource"
            fullWidth={true}
            onChange={handleSetUrl}
            variant="standard"
          />
        </Grid>
        <Grid item={true} style={{ flex: 1 }}>
          <TextField
            key={"namefor-" + url}
            id="workspaceName"
            label="Resource name"
            fullWidth={true}
            defaultValue={name}
            onChange={handleSetName}
            variant="standard"
          />
        </Grid>
        <Grid item={true} alignItems="flex-end">
          <Button variant="contained" onClick={handleAddResource}>
            Upload
              </Button>
        </Grid>
      </Grid>
    </>
  );
};
