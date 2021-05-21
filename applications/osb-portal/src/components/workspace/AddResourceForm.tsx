import * as React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

import workspaceResourceService, { urlToName } from '../../service/WorkspaceResourceService'
import { Workspace } from '../../types/workspace';
import CircularProgress from '@material-ui/core/CircularProgress';


interface WorkspaceEditProps {
  workspace: Workspace;
  onResourceAdded: () => void;
  onSubmit: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
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

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>{children}</Box>
      )}

    </div>
  );
}
export default (props: WorkspaceEditProps) => {

  const { workspace, onResourceAdded } = props;

  const [url, setUrl] = React.useState<string>(null);

  const [name, setName] = React.useState<string>(null);

  const [nameError, setNameError] = React.useState<string>(null);

  const [urlError, setUrlError] = React.useState<string>(null);

  const [waiting, setWaiting] = React.useState(false);

  const [tabValue, setTabValue] = React.useState(0);

  

  const handleTabChange = (event: React.ChangeEvent<{}>, newTabValue: number) => {
    setTabValue(newTabValue);
  }

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
      <Tabs onChange={handleTabChange} value={tabValue} aria-label="add-resourse-to-workspace-options">
        <Tab label="URL" {...a11yProps(0)}/>
        <Tab label="OSB" {...a11yProps(1)}/>
        <Tab label="Computer" {...a11yProps(2)}/>
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        Item 1
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        Item 2
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        Item 3
      </TabPanel>
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
