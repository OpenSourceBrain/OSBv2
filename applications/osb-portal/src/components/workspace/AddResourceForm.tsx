import * as React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
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
import { 
  bgRegular,
  bgLightest,
  bgLighter,
  fontColor,
  linkColor,
  bgInputs,
  paragraph,
  bgLightestShade,
  radius,
  primaryColor,
} from "../../theme";



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
      display: 'block',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      justifyContent: 'center',
      width: '100%',
      height: 'fit-content',
      "& .MuiTabs-flexContainer": {
        "& .Mui-selected": {
          backgroundColor: bgLighter,
        },
      },
      "& div button": {
        border: '2px solid #616161',
        borderRadius: radius,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1),
        flexWrap: "wrap",
        height: '100%',
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
  tabTitle: {
    fontSize: '0.9rem',
    marginBottom: '0.3rem',
  },
  root: {
    padding: theme.spacing(2),
    paddingTop: 0,
    fontWeight: 'normal',
  },
  addByUploadForm: {
    paddingTop: 0,
    marginBottom: theme.spacing(3),
    "& .MuiButton-root": {
      marginLeft: theme.spacing(4),
      height: 'fit-content',
      borderRadius: '2px',
      width: 'fit-content',
      alignItems: 'center',
    },
    "& .MuiTextField-root": {
      "& .MuiInput-root": {
        fontWeight: 'normal',
        "& input": {
          "& ::placeholder": {
            fontWeight: 'normal',
          },
        },
      },
      "& .MuiFormHelperText-root":{
        fontWeight: 'normal',
        fontSize: '0.7rem',
        color: '#e0e0e0',
      },
    },
  },
  tabPanel: {
    marginTop: theme.spacing(3),
    // maxHeight: '300px',
    // overflow: 'auto',
    miHeight: 'fit-content',
    // maxHeight: '400px',
    // overflow: 'auto',
    // "&::-webkit-scrollbar-thumb": {
    //   backgroundColor: bgInputs,
    // },
    // "&::-webkit-scrollbar-track": {
    //   backgroundColor: 'transparent',
    // },
    // "& #tabpanel-1": {
    //   miHeight: 'fit-content',
    //   maxHeight: '400px',
    //   overflow: 'auto',
    //   "&::-webkit-scrollbar-thumb": {
    //     backgroundColor: bgInputs,
    //   },
    //   "&::-webkit-scrollbar-track": {
    //     backgroundColor: 'transparent',
    //   },
    // },
  },
  repositoryBrowserContainer: {
    maxHeight: '400px',
    overflow: 'auto',
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: bgInputs,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: 'transparent',
    },
    "& .scrollbar": {
      paddingRight: 0,
      "& .MuiList-root": {
        padding: 0,
        marginTop: theme.spacing(1),
        "& .flex-grow-1": {
          borderBottom: `1px solid ${bgRegular}`,
          borderTop: `1px solid ${bgRegular}`,
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
          marginLeft: theme.spacing(2),
          width: '100%',
        },
        "& p": {
          fontSize: ".8rem",
          display: "flex",
          alignItems: "flex-end",
          color: fontColor,
          "& span": {
            fontSize: ".8rem",
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
              color: linkColor,
              height: '1rem',
            },
          },
          "& .MuiSvgIcon-root": {
            color: bgInputs,
            height: '1rem',
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
          "& .MuiListItemIcon-root": {
            minWidth: 'fit-content',
          },
        },
      },
      "& .flex-grow-1": {
        flexGrow: 1,
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
  },
  circularProgress: {
    height: '40px',
    width: '40px',
    position: 'relative',
    left: '45%',
  },
  fromOSBTabPanel: {
    // maxHeight: '400px',
    // overflow: 'auto',
    backgroundColor: bgLightest,
    borderRadius: radius,
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    // "&::-webkit-scrollbar-thumb": {
    //   backgroundColor: bgInputs,
    // },
    // "&::-webkit-scrollbar-track": {
    //   backgroundColor: 'transparent',
    // },
    "& .MuiBreadcrumbs-root": {
      display: 'none',
    },
    "& .MuiTextField-root": {
      backgroundColor: '#3b3b3b',
      borderRadius: '2px',
    },
  },
}));

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

  React.useEffect(() => {
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
        <Tab 
          className={classes.tab}
          label={<>
            <Typography className={classes.tabTitle} component="span">By URL</Typography>
            <BackupIcon />
          </>} 
        />
        <Tab 
          className={classes.tab}
          label={<>
            <Typography className={classes.tabTitle} component="span">From OSB Repository</Typography>
            <LinkIcon />
            </>}
        />
        <Tab
          className={classes.tab}
          label={<>
            <Typography className={classes.tabTitle} component="span">Upload from computer</Typography>
            <PublishIcon />
          </>}
        />
      </Tabs>
      <Box className={classes.tabPanel}>
        <TabPanel value={tabValue} index={0}>
          <Grid container={true} spacing={2} justify="flex-start" alignItems="stretch" direction="column">
            <Grid item={true} className={classes.addByUploadForm}>
              <TextField
                id="resource-url-input"
                key="input-resource-url"
                error={Boolean(urlError)}
                helperText={urlError ? urlError : "Only select files for which you have confirmed that you have the licence to use" }
                placeholder="Paste URL of resource"
                fullWidth={true}
                onChange={handleSetUrl}
                variant="standard"
              />

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
            {/* <Grid item={true} alignItems="flex-end">
              
            </Grid> */}
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box className={classes.fromOSBTabPanel}>
          {repository ? 
            <Box 
            className={classes.repositoryBrowserContainer}
            >
            <RepositoryResourceBrowser repository={repository} checkedChanged={setChecked}/>
            </Box>
            :
             <CircularProgress className={classes.circularProgress} />
          } 
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          Item 3
        </TabPanel>
      </Box>
    </Box>
  );
};
