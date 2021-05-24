import * as React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import BackupIcon from '@material-ui/icons/Backup';
import LinkIcon from '@material-ui/icons/Link';
import PublishIcon from '@material-ui/icons/Publish';

import RepositoryResourceBrowser from '../repository/RepositoryResourceBrowser';
import workspaceResourceService, { urlToName } from '../../service/WorkspaceResourceService';
import { OSBRepository, RepositoryResourceNode } from '../../apiclient/workspaces';
import { Workspace } from '../../types/workspace';
import CircularProgress from '@material-ui/core/CircularProgress';
import RepositoryService from "../../service/RepositoryService";
import { useEffect } from "react";


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


const useStyles = makeStyles((theme) => ({
  tabs: {
    height: 'fit-content',
    "& .MuiTabs-scroller": {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      height: 'fit-content',
      "& div button": {
        border: 'none',
        padding: 0,
      },
      "& .MuiTabs-scrollButtonAuto": {
        display: 'none',
        "& .Mui-diabled": {
          width: 0,
        },
      },
      "& .MuiTabs-scrollButton-root": {
        display: 'none',
        width: 0,
      },
      "& .Mui-diabled": {
        width: 0,
      },
    },
    "& .MuiTabs-scrollButton-root": {
      display: 'none',
      width: 0,
    },
  },
  tab: {
    border: 'none',
  },
  root: {
    padding: theme.spacing(2),
  },
}))

let checked = [];

const setChecked = (newChecked: RepositoryResourceNode[]) => {
  checked = newChecked;
}

export default (props: WorkspaceEditProps) => {

  const classes = useStyles();

  const { workspace, onResourceAdded } = props;

  const [url, setUrl] = React.useState<string>(null);

  const [name, setName] = React.useState<string>(null);

  const [nameError, setNameError] = React.useState<string>(null);

  const [urlError, setUrlError] = React.useState<string>(null);

  const [waiting, setWaiting] = React.useState(false);

  const [tabValue, setTabValue] = React.useState(0);

  const [repository, setRepository] = React.useState<OSBRepository>();

  useEffect(() => {
    RepositoryService.getRepository(1).then((repo) =>
    setRepository(repo)
    );
  }, []);

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
    <Box className={classes.root}>
      <Tabs className={classes.tabs} onChange={handleTabChange} value={tabValue} aria-label="add-resourse-to-workspace-options" variant="fullWidth">
        <Tab className={classes.tab} label="By URL" {...a11yProps(0)} icon={<BackupIcon />}/>
        <Tab label="From OSB repository" {...a11yProps(1)} icon={<LinkIcon />}/>
        <Tab label="Upload from computer" {...a11yProps(2)} icon={<PublishIcon />}/>
      </Tabs>
      <TabPanel value={tabValue} index={0}>
      <Grid container={true} spacing={2} justify="flex-start" alignItems="stretch" direction="column">
        <Grid item={true} style={{ flex: 1 }}>
          <TextField
            id="resource-url-input"
            key="input-resource-url"
            error={Boolean(urlError)}
            helperText={urlError}
            placeholder="Paste URL of resource"
            fullWidth={true}
            onChange={handleSetUrl}
            variant="standard"
          />
        </Grid>
        {/* <Grid item={true} style={{ flex: 1 }}>
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
        </Grid> */}
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
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <RepositoryResourceBrowser repository={repository} checkedChanged={setChecked}/>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        Item 3
      </TabPanel>
    </Box>
  );
};
