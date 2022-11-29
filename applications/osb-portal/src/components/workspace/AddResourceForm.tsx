import * as React from "react";
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import BackupIcon from "@mui/icons-material/Backup";
import LinkIcon from "@mui/icons-material/Link";

import RepositoryResourceBrowser from "../repository/RepositoryResourceBrowser";
import workspaceResourceService, {
  urlToName,
} from "../../service/WorkspaceResourceService";
import {
  OSBRepository,
  RepositoryResourceNode,
} from "../../apiclient/workspaces";
import { Workspace } from "../../types/workspace";
import CircularProgress from "@mui/material/CircularProgress";
import RepositoryService from "../../service/RepositoryService";
import {
  bgLighter,
  fontColor,
  bgInputs,
  radius,
  bgLight,
  bgDarker,
} from "../../theme";
import WorkspaceService from "../../service/WorkspaceService";
import Repositories from "../repository/Repositories";
import OSBPagination from "../common/OSBPagination";
import SearchFilter from "../../types/searchFilter";

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

let firstTimeFiltering = true;

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
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  tabs: {
    height: "fit-content",
    "& .MuiTabs-scroller": {
      display: "block",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      height: "fit-content",
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
          height: "100%",
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
    display: "flex",
    alignItems: "flex-end",
    "& .MuiButton-root": {
      marginLeft: theme.spacing(3),
      height: "fit-content",
      borderRadius: "2px",
    },
    "& .MuiTextField-root": {
      "& .MuiFormHelperText-root": {
        fontSize: "0.7rem",
        color: fontColor,
      },
    },
  },
  tabPanel: {
    marginTop: theme.spacing(3),
    miHeight: "fit-content",
    "& #tabpanel-1": {
      "& .MuiBox-root": {
        "& .copy-info": {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: theme.spacing(2),
          "& .MuiGrid-item": {
            "& .MuiTypography-root": {
              fontSize: "0.75rem",
            },
            "& .MuiButton-root": {
              height: "fit-content",
              borderRadius: "2px",
            },
          },
        },
      },
    },
  },
  repositoryBrowserContainer: {
    backgroundColor: bgLight,
    borderRadius: radius,
    "& .repositories-list": {
      "& .MuiBox-root": {
        maxHeight: "400px",
        borderRadius: radius,
        "& .MuiGrid-container": {
          paddingTop: 0,
          paddingBottom: 0,
          backgroundColor: bgLight,
          "&:hover": {
            backgroundColor: bgDarker,
          },
        },
      },
    },
    "& .resource-browser": {
      overflow: "hidden",
      "& .scrollbar": {
        maxHeight: "400px",
        overflow: "auto",
        marginTop: 0,
        "& .MuiList-root": {
          paddingRight: "1rem",
          marginTop: 0,
          "& .MuiListItem-root": {
            alignItems: "baseline",
            "& .flex-grow-1": {
              paddingTop: "0.4rem",
              paddingBottom: "0.4rem",
            },
          },
          "& p": {
            fontSize: "0.8rem",
            color: fontColor,
            "& span": {
              fontSize: "0.8rem",
              color: bgInputs,
            },
            "& .icon": {
              width: "2rem",
              display: "flex",
              "& .MuiSvgIcon-root": {
                height: "1rem",
              },
            },
          },
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: bgInputs,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
      },
      "& .flex-grow-1": {
        width: "100%",
      },
      "& .MuiTextField-root": {
        width: "96%",
        marginRight: "2%",
        marginLeft: "2%",
        padding: "0.6rem",
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

  const [fromOSBRepositoryConfirmation, setFromOSBRepositoryConfirmation] =
    React.useState<string>(null);

  const [waiting, setWaiting] = React.useState(false);

  const [tabValue, setTabValue] = React.useState(0);

  const [checked, setChecked] = React.useState<RepositoryResourceNode[]>([]);

  const [selectedRepository, setRepository] =
    React.useState<OSBRepository>(null);

  const [repositoryLoading, setRepositoryLoading] = React.useState(false);

  const [repositories, setRepositories] = React.useState<OSBRepository[]>(null);

  const [page, setPage] = React.useState(1);

  const [totalPages, setTotalPages] = React.useState(0);

  const [filter, setFilter] = React.useState<SearchFilter>(undefined);

  React.useEffect(() => {
    if (filter === undefined) {
      if (!firstTimeFiltering) {
        setPage(1);
      }
      RepositoryService.getRepositoriesDetails(page).then((reposDetails) => {
        setRepositories(reposDetails.osbrepositories);
        setTotalPages(reposDetails.pagination.numberOfPages);
      });
    } else {
      if (firstTimeFiltering) {
        firstTimeFiltering = false;
        RepositoryService.getRepositoriesByFilter(1, filter).then((repos) => {
          setRepositories(repos.osbrepositories);
          setTotalPages(repos.pagination.numberOfPages);
        });
      } else {
        RepositoryService.getRepositoriesByFilter(page, filter).then(
          (repos) => {
            setRepositories(repos.osbrepositories);
            setTotalPages(repos.pagination.numberOfPages);
          }
        );
      }
    }
  }, [page, filter]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setPage(pageNumber);
  };

  const handleTabChange = (
    event: React.ChangeEvent<{}>,
    newTabValue: number
  ) => {
    setTabValue(newTabValue);
    setFromOSBRepositoryConfirmation(null);
    setChecked([]);
  };

  const loadRepository = (repositoryId: number) => {
    setRepositoryLoading(true);
    RepositoryService.getRepository(repositoryId).then((repo) => {
      setRepository(repo);
    });
  };

  const handleBackAction = () => {
    setRepositoryLoading(false);
    setRepository(null);
    setChecked([]);
  };

  const handleSetUrl = (e: any) => {
    setUrl(e.target.value);
    setName(urlToName(e.target.value));
  };

  const handleSetName = (e: any) => setName(e.target.value);

  const setCheckedArray = (newChecked: RepositoryResourceNode[]) => {
    setChecked(newChecked);
  };

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
      setUrlError("Insert a valid public http url");
    }
    if (!error) {
      setWaiting(true);
      workspaceResourceService
        .addResource(workspace, url, name)
        .then(() => {
          onResourceAdded();
        })
        .catch(() => {
          alert("An error occurred while adding the resource");
        });
    }
  };

  const handleCopy = () => {
    if (checked.length === 0) {
      setFromOSBRepositoryConfirmation(
        "Please select a resource to add to your workspace."
      );
      return;
    }
    setWaiting(true);
    WorkspaceService.importResourcesToWorkspace(
      workspace.id,
      checked.map((c) => c.resource)
    )
      .then(() => {
        setFromOSBRepositoryConfirmation(
          "Resources successfully imported to workspace."
        );
        setChecked([]);
        setWaiting(false);
        onResourceAdded();
      })
      .catch(() => {
        setFromOSBRepositoryConfirmation(
          "An error occured while adding the resource(s)"
        );
        setWaiting(false);
      });
  };

  return (
    <Box className={classes.root}>
      <Tabs
        className={classes.tabs}
        onChange={handleTabChange}
        value={tabValue}
        aria-label="add-resourse-to-workspace-options"
        variant="fullWidth"
      >
        <Tab
          label={
            <>
              <Typography component="span">By URL</Typography>
              <BackupIcon />
            </>
          }
        />
        <Tab
          label={
            <>
              <Typography component="span">From OSB Repository</Typography>
              <LinkIcon />
            </>
          }
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
          <Grid
            container={true}
            spacing={2}
            justifyContent="flex-start"
            alignItems="stretch"
            direction="column"
          >
            <Grid item={true}>
              <TextField
                id="resource-url-input"
                key="input-resource-url"
                error={Boolean(urlError)}
                helperText={
                  urlError
                    ? urlError
                    : "Only select files for which you have confirmed that you have the licence to use"
                }
                placeholder="Paste URL of resource"
                fullWidth={true}
                onChange={handleSetUrl}
                variant="standard"
              />
            </Grid>
            <Grid
              item={true}
              style={{ flex: 1 }}
              className={classes.addByUploadForm}
            >
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

              <Button
                variant="contained"
                onClick={handleAddResource}
                disabled={waiting}
              >
                Upload
              </Button>
              {waiting && (
                <CircularProgress
                  size={24}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: -12,
                    marginLeft: -12,
                  }}
                />
              )}
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box className={classes.repositoryBrowserContainer}>
            {repositoryLoading ? (
              selectedRepository ? (
                <Box className="resource-browser">
                  <RepositoryResourceBrowser
                    repository={selectedRepository}
                    checkedChanged={setCheckedArray}
                    backAction={handleBackAction}
                  />
                </Box>
              ) : (
                <CircularProgress
                  size={40}
                  style={{
                    position: "relative",
                    left: "45%",
                  }}
                />
              )
            ) : repositories ? (
              <>
                <Box className="repositories-list">
                  <Repositories
                    repositories={repositories}
                    handleRepositoryClick={(repositoryId: number) =>
                      loadRepository(repositoryId)
                    }
                    showSimpleVersion={true}
                    searchRepositories={true}
                    filterChanged={(newFilter) => setFilter(newFilter)}
                  />
                </Box>
                {totalPages > 1 ? (
                  <OSBPagination
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                    color="primary"
                    showFirstButton={true}
                    showLastButton={true}
                  />
                ) : null}
              </>
            ) : null}
          </Box>
          <Grid container={true} spacing={1} className="copy-info">
            <Grid item={true} xs={8}>
              {waiting ? (
                <CircularProgress size={25} />
              ) : fromOSBRepositoryConfirmation ? (
                <Typography component="h5">
                  {fromOSBRepositoryConfirmation}
                </Typography>
              ) : (
                <Typography component="h6">
                  Copy will duplicate the resource inside your workspace. The
                  resource won't be automatically synched with the source. To
                  resync, add the resource again from the repository.
                </Typography>
              )}
            </Grid>
            <Grid item={true}>
              <Button
                variant="contained"
                onClick={handleCopy}
                disabled={waiting || selectedRepository == null}
              >
                Copy
              </Button>
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
