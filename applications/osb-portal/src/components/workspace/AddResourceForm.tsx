import * as React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import BackupIcon from '@material-ui/icons/Backup';
import LinkIcon from '@material-ui/icons/Link';
import PublishIcon from '@material-ui/icons/Publish';
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

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
  bgLight,
  bgDarker,
  checkBoxColor,
  teal,
  purple,
} from "../../theme";
import WorkspaceService from "../../service/WorkspaceService";



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
      height: 'fit-content',
      "& .MuiTabs-flexContainer": {
        "& .Mui-selected": {
          backgroundColor: bgLighter,
        },
        "& .MuiTab-root": {
          border: `2px solid ${bgLighter}`,
          borderRadius: radius,
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
          marginRight: theme.spacing(1),
          marginLeft: theme.spacing(1),
          height: '100%',
        },
      },
    },
  },
  root: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  addByUploadForm: {
    paddingTop: 0,
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'flex-end',
    "& .MuiButton-root": {
      marginLeft: theme.spacing(3),
      height: 'fit-content',
      borderRadius: '2px',
    },
    "& .MuiTextField-root": {
      "& .MuiFormHelperText-root":{
        fontSize: '0.7rem',
        color: fontColor,
      },
    },
  },
  tabPanel: {
    marginTop: theme.spacing(3),
    miHeight: 'fit-content',
    "& #tabpanel-1": {
      "& .MuiBox-root": {
        "& .MuiGrid-container": {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: theme.spacing(2),
          "& .MuiGrid-item": {
            "& .MuiTypography-root": {
              fontSize: '0.75rem',
            },
            "& .MuiButton-root": {
              height: 'fit-content',
              borderRadius: '2px',
            },
          },
        },
      },
    },
  },
  repositoryBrowserContainer: {
    backgroundColor: bgLightest,
    borderRadius: radius,
    "& .MuiButton-root": {
      display: 'flex',
      minWidth: 'fit-content',
      marginLeft: theme.spacing(1),
    },
    "& .MuiTextField-root": {
      width: '96%',
      marginRight: '2%',
      marginLeft: '2%',
      "& .MuiInput-root": {
        background: bgLightestShade,
        height: '2.5rem',
        borderRadius: '2px',
        paddingLeft: '0.5rem',
        "&:before": {
            display: "none",
          },
          "&:after": {
            display: "none",
          },
      },
    },
    "& .scrollbar": {
      maxHeight: '400px',
      overflow: 'auto',
      paddingLeft: '10px',
      "& .MuiGrid-container": {
        "&:hover": {
          backgroundColor: bgLightestShade,
        },
        borderBottom: `0.01rem solid ${bgLightestShade}`,
        "& .MuiGrid-grid-md-6": {
          justifyContent: 'center',
        },
        "& .MuiGrid-item": {
          "& .MuiBox-root": {
            "& p": {
              color: paragraph,
            },
            "& .tag": {
              background: bgLightestShade,
              textTransform: 'capitalize',
              borderRadius: '1rem',
              color: paragraph,
              height: '1.9rem',
              fontSize: "0.75rem",
              margin: "0.5rem",
              "& .MuiSvgIcon-root": {
                width: ".63rem",
                height: ".63rem",
                marginRight: theme.spacing(1),
                "&.MuiSvgIcon-colorPrimary": {
                  color: teal,
                },
                "&.MuiSvgIcon-colorSecondary": {
                  color: purple,
                },
              },
            },
            "& .MuiButton-root": {
              "& .MuiButton-label": {
                "& .MuiAvatar-root": {
                  width: ".5rem",
                  height: "auto",
                },
              },
            },
          },
        },
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: bgInputs,
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: 'transparent',
      },
      "& .MuiList-root": {
        paddingRight: '1rem',
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
          color: fontColor,
          "& span": {
            fontSize: ".8rem",
            color: bgInputs,
          },
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
        "& .MuiIconButton-root": {
          margin: 0,
          padding: 0,
        },
        "& .MuiListItem-root": {
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
          "& .MuiListItemIcon-root": {
            "& .MuiCheckbox-colorSecondary": {
              color: checkBoxColor,
              "&.Mui-checked": {
                color: linkColor,
              },
            },
            minWidth: 'fit-content',
          },
        },
      },
    },
    "& .MuiBreadcrumbs-root": {
      padding: theme.spacing(1),
      "& .MuiBreadcrumbs-ol": {
        lineHeight: 1,
        "& .MuiAvatar-root": {
          width: "auto",
          borderRadius: 0,
          height: "auto",
        },
        "& .MuiBreadcrumbs-li": {
          "& .MuiTypography-root": {
            lineHeight: 1,
            cursor: 'pointer',
            color: fontColor,
          },
        },
      },
    },
  },
}));



export default (props: WorkspaceEditProps) => {

  const classes = useStyles();

  const { workspace, onResourceAdded } = props;

  const [url, setUrl] = React.useState<string>(null);

  const [name, setName] = React.useState<string>(null);

  const [nameError, setNameError] = React.useState<string>(null);

  const [urlError, setUrlError] = React.useState<string>(null);

  const [fromOSBRepositoryConfirmation, setFromOSBRepositoryConfirmation] = React.useState<string>(null);

  const [waiting, setWaiting] = React.useState(false);

  const [tabValue, setTabValue] = React.useState(0);

  const [checked, setChecked] = React.useState<RepositoryResourceNode[]>([]);

  const [repository, setRepository] = React.useState<OSBRepository>(null);

  const [repositoryLoading, setRepositoryLoading] = React.useState(false);

  const [repositories, setRepositories] = React.useState<OSBRepository[]>(null);

  React.useEffect(() => {
    RepositoryService.getRepositories(1).then((repos) =>
    setRepositories(repos)
    );
  }, []);

  const handleTabChange = (event: React.ChangeEvent<{}>, newTabValue: number) => {
    setTabValue(newTabValue);
    setFromOSBRepositoryConfirmation(null);
    setChecked([]);
  }

  const loadRepository = (repositoryId: number) => {
    setRepositoryLoading(true);
    RepositoryService.getRepository(repositoryId).then((repo) => {
      setRepository(repo);
    });
  }

  const handleBackAction = () => {
    setRepositoryLoading(false);
    setRepository(null);
    setChecked([]);
  }

  const handleSetUrl = (e: any) => {
    setUrl(e.target.value);
    setName(urlToName(e.target.value));
  }

  const handleSetName = (e: any) => setName(e.target.value);

  const setCheckedArray = (newChecked: RepositoryResourceNode[]) => {
    setChecked(newChecked);
  }

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

  const handleCopy = () => {
    if(checked.length === 0){
      setFromOSBRepositoryConfirmation("Please select a resource to add to your workspace.");
      return;
    }
    setWaiting(true);
    WorkspaceService.importResourcesToWorkspace(workspace.id, checked.map(c => c.resource)).then(() => {
      setFromOSBRepositoryConfirmation("Resources successfully imported to workspace.");
      setChecked([]);
      setWaiting(false);
    }).catch(() => {
      setFromOSBRepositoryConfirmation("An error occured while adding the resource(s)");
      setWaiting(false);
    });
  }

  return (
    <Box className={classes.root}>
      <Tabs className={classes.tabs} onChange={handleTabChange} value={tabValue} aria-label="add-resourse-to-workspace-options" variant="fullWidth">
        <Tab 
          label={<>
            <Typography component="span">By URL</Typography>
            <BackupIcon />
          </>} 
        />
        <Tab
          label={<>
            <Typography component="span">From OSB Repository</Typography>
            <LinkIcon />
            </>}
        />
        {/* <Tab
          className={classes.tab}
          label={<>
            <Typography className={classes.tabTitle} component="span">Upload from computer</Typography>
            <PublishIcon />
          </>}
        /> */}
      </Tabs>
      <Box className={classes.tabPanel}>
        <TabPanel value={tabValue} index={0}>
          <Grid container={true} spacing={2} justify="flex-start" alignItems="stretch" direction="column">
            <Grid item={true}>
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
            </Grid>
            <Grid item={true} style={{ flex: 1 }} className={classes.addByUploadForm}>
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
          <Box 
            className={classes.repositoryBrowserContainer}
          >
            {repositoryLoading ?
              repository ?
              
              <RepositoryResourceBrowser repository={repository} checkedChanged={setCheckedArray} backAction={handleBackAction}/>
            :
              <CircularProgress size={40} 
                style={{
                    position: 'relative',
                    left: '45%',
                  }} 
              /> 
              
            :
            repositories ?
            <Box className="scrollbar">
            {repositories.map((repository) => (
              <Grid
                container={true}
                className="row"
                spacing={0}
                key={repository.id}
              >
                <Grid item={true} xs={12} sm={4} md={5}>
                  <Box className="col">
                    <Typography component="strong">
                      {repository.name}
                    </Typography>
                    <Typography>{repository.summary}</Typography>
                  </Box>
                </Grid>
                <Grid item={true} xs={12} sm={4} md={6}>
                  <Box
                    className="col"
                    display="flex"
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    {repository.contentTypes.split(",").map((type, index) => (
                      <Box
                        className="tag"
                        display="flex"
                        alignItems="center"
                        paddingX={1}
                        marginY={1}
                        key={type}
                      >
                        <FiberManualRecordIcon
                          color={index % 2 === 0 ? "primary" : "secondary"}
                        />
                        {type}
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid item={true} xs={12} sm={12} md={1}>
                  <Box
                    className="col"
                    display="flex"
                    flex={1}
                    alignItems="center"
                  >
                    <Button onClick={ () => loadRepository(repository.id) }>
                      <Avatar src="/images/arrow_right.svg" />
                    </Button>
                    
                  </Box>
                </Grid>
              </Grid>
            ))}
          </Box> :
          (
            <CircularProgress size={40} 
              style={{
                  position: 'relative',
                  left: '45%',
                }} 
            /> 
          )}
          </Box> 
          <Grid container spacing={1}>
            <Grid item xs={8}>
              {
                waiting ? <CircularProgress size={25}/> :

                fromOSBRepositoryConfirmation ? 

                  <Typography component="h5">
                    {fromOSBRepositoryConfirmation}
                  </Typography> :

                  <Typography component="h6">
                  Copy will duplicate the resource inside your workspace and use your storage quota.
                  Link will add it as a reference and the resource inside your workspace will be updated
                  when the repository is.
                  </Typography>
              }
              
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleCopy} disabled={waiting || repository == null}>Copy</Button>
            </Grid>
          </Grid>
        </TabPanel>
        {/* <TabPanel value={tabValue} index={2}>
          Upload from computer - to be implemented
        </TabPanel> */}
      </Box>
    </Box>
  );
};
