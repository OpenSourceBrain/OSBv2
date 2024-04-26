import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import LinkIcon from "@mui/icons-material/Link";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LanguageIcon from "@mui/icons-material/Language";
import GroupIcon from "@mui/icons-material/Group";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import { BitBucketIcon } from "../components/icons";
import BusinessIcon from "@mui/icons-material/Business";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Tooltip from "@mui/material/Tooltip";

import { Workspace } from "../types/workspace";
import { OSBRepository } from "../apiclient/workspaces";
import workspaceService from "../service/WorkspaceService";
import WorkspaceCard from "../components/workspace/WorkspaceCard";
import RepositoryService from "../service/RepositoryService";
import {
  bgDarkest,
  bgDarker,
  linkColor,
  paragraph,
  textColor,
  bgLightest as lineColor,
} from "../theme";
import { USER_QUOTAS } from '../content.js'
import UserEditor from "../components/user/UserEditor";
import { User } from "../apiclient/accounts";
import { getUser, updateUser } from "../service/UserService";
import { UserInfo } from "../types/user";
import RepositoriesTable from "../components/repository/RespositoriesTable";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { IconButton } from "@mui/material";
import { getNotebooksNamedServerLink } from "../utils";

const styles = {
  profileInformation: (theme) => ({
    flexDirection: "column",
    backgroundColor: bgDarker,
    borderRight: `1px solid ${lineColor}`,
    paddingRight: theme.spacing(3),
    "& .MuiSvgIcon-root": {
      marginRight: "5px",
      color: paragraph,
    },
    "& .MuiAvatar-root": {
      width: "150px",
      height: "150px",
      marginBottom: theme.spacing(2),
    },
    "& .name": {
      color: textColor,
      flex: "none",
    },
    "& h2": {
      marginBottom: "0.5em",
    },
    "& .username": {},
    "& .MuiButton-root": {
      width: "100%",
    },
    "& .links": {
      "& .MuiTypography-root": {
        display: "flex",
      },
    },
    "& .groups": {
      "& .MuiTypography-root": {
        color: textColor,
      },
      "& .MuiChip-root": {
        color: paragraph,
        border: `1px solid ${paragraph}`,
      },
      "& .first-chip": {
        marginLeft: 0,
      },
    },
  }),
  repositoriesAndWorkspaces: (theme) => ({
    flexDirection: "column",
    paddingBottom: "0px !important",
    backgroundColor: bgDarker,
  }),
  showMoreText: {
    color: paragraph,
    "& a": {
      color: linkColor,
      display: "flex",
      textDecoration: "none",
      "& .MuiSvgIcon-root": {
        color: `${linkColor} !important`,
      },
    },
  },
  dot: {
    height: "5px",
    width: "5px",
    alignSelf: "center",
    marginLeft: "5px",
  },
  repository: {
    cursor: "pointer",
  },
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
        <Box>
          <Typography component="section">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

const BIG_NUMBER_OF_ITEMS = 1000;
export const UserPage = (props: any) => {
  const [tabValue, setTabValue] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [publicWorkspaces, setPublicWorkspaces] = React.useState<Workspace[]>(
    []
  );
  const [allWorkspaces, setAllWorkspaces] = React.useState<Workspace[]>([]);
  const [profileEditDialogOpen, setProfileEditDialogOpen] =
    React.useState(false);
  const [repositories, setRepositories] = React.useState<OSBRepository[]>([]);
  const [user, setUser] = React.useState<User>(null);

  const navigate = useNavigate();
  const { userName } = useParams<{ userName: string }>();
  const [error, setError] = React.useState<any>(null);


  const [loading, setLoading] = React.useState(false);
  const currentUser: UserInfo = props.user;

  const handleTabChange = (
    event: React.SyntheticEvent,
    newTabValue: number
  ) => {
    setTabValue(newTabValue);
  };

  React.useEffect(() => {
    getUser(userName).then((u) => {
      setUser(u);
    }).catch((e) => {
      setError(e);
    });
  }, [userName, props.workspacesCounter]);

  React.useEffect(() => {
    if (!user) return;

    const userId = user.id;
    workspaceService
      .fetchWorkspacesByFilter(
        true,
        false,
        1,
        { user_id: `${userId}` },
        BIG_NUMBER_OF_ITEMS
      )
      .then(
        (workspacesRetrieved) => {
          setPublicWorkspaces(workspacesRetrieved.items);
        },
        (e) => {
          setError(e);
        }
      );
    if (currentUser && (currentUser.id === userId || currentUser.isAdmin)) {
      workspaceService
        .fetchWorkspacesByFilter(
          false,
          false,
          1,
          { user_id: `${userId}` },
          BIG_NUMBER_OF_ITEMS
        )
        .then(
          (workspacesRetrieved) => {
            setAllWorkspaces(workspacesRetrieved.items);
          },
          (e) => {
            setError(e);
          }
        );
    }
    RepositoryService.getRepositories(1, BIG_NUMBER_OF_ITEMS, userId).then(
      (repositoriesRetrieved) => {
        setRepositories(repositoriesRetrieved);
      },
      (e) => {
        setError(e);
      }
    );
  }, [user]);

  if (error) {
    throw error;
  }

  if (!user || user.profiles === undefined) {
    return null;
  }

  const getPrivateWorkspaces = () => {
    // remove public workspaces from the list of all workspaces
    const privateWorkspaces: Workspace[] = allWorkspaces.filter(
      (ws: Workspace) => {
        const tempWorkspaces: Workspace[] = publicWorkspaces.filter((pws) => {
          return pws.id === ws.id;
        });

        if (tempWorkspaces.length > 0) {
          return false;
        }

        return true;
      }
    );

    return privateWorkspaces;
  };

  const privateWorkspaces = getPrivateWorkspaces();

  const openRepoUrl = (repositoryId: number) => {
    navigate(`/repositories/${repositoryId}`);
  };
  /* the keys are stored in lower case */
  const {
    affiliation,
    incf,
    bitbucket,
    github,
    twitter,
    orcid,
    ...otherProfiles
  } = user.profiles as unknown as { [k: string]: string };

  const handleUpdateUser = (u: User) => {
    setLoading(true);
    setProfileEditDialogOpen(false);
    updateUser(u)
      .then((updatedUser) => {
        setUser({ ...updatedUser, ...u });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error("error updating user", err);
        setError({
          ...error,
          general: `An error occurred updating the user. Please try again later.`,
        });
      });
  };

  const onGroupClick = (groupname) => {
    navigate(`/user/${user.username}/groups/${groupname}`);
  }

  const navigateToNotebookNamedServerLink = () => {
    const serverlink = getNotebooksNamedServerLink()
    if (serverlink) {
      window.open(serverlink, "_blank");
    }
    return
  }

  const openWorkspaceUrl = (workspaceId: number) => {
    navigate(`/workspaces/${workspaceId}`);
  };

  const canEdit =
    currentUser && (currentUser.id === user.id || currentUser.isAdmin);
  return (
    <>
      <Box className={`verticalFill`} display="flex" justifyContent="center">
        <Grid container={true} spacing={0} className="verticalFill">
          <Grid
            id="profile-info"
            item={true}
            sm={4}
            lg={3}
            sx={styles.profileInformation}
            className="scrollbar"
          >
            <Stack pt={5} px={4} spacing={4}>
              <Avatar alt="user-profile-avatar" src={user.avatar}>
                {(user.firstName.length > 0 && user.firstName.charAt(0)) +
                  (user.lastName.length > 0 && user.lastName.charAt(0))}
              </Avatar>
              <Typography className="name" component="h1" variant="h2">
                {user.firstName + " " + user.lastName}
                <Typography
                  className="username"
                  component="p"
                  variant="subtitle2"
                >
                  {user.username}
                </Typography>
              </Typography>

              {canEdit && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setProfileEditDialogOpen(true)}
                >
                  Edit My Profile
                </Button>
              )}

              <Typography display="flex" flexDirection="row" color={paragraph}>
                {publicWorkspaces ? (
                  <>
                    <FolderOpenIcon fontSize="small" />
                    {allWorkspaces.length} workspaces
                  </>
                ) : (
                  <CircularProgress size="1rem" />
                )}
                {canEdit && allWorkspaces ? (
                  <> ({privateWorkspaces.length} private) </>
                ) : (
                  <> </>
                )}
                {repositories ? (
                  <>
                    <FiberManualRecordIcon sx={styles.dot} fontSize="small" />
                    <AccountTreeOutlinedIcon fontSize="small" />
                    {repositories.length} repositories
                  </>
                ) : (
                  <CircularProgress size="1rem" />
                )}
              </Typography>

              {(Object.keys(user.profiles).length !== 0 || user.website) && (
                <Box
                  className="links"
                  display="flex"
                  flexDirection="column"
                  width="100%"
                >
                  <Typography component="h2" variant="h5" gutterBottom={true}>
                    Links
                  </Typography>
                  {typeof user.website === "string" && user.website && (
                    <Typography
                      component="p"
                      variant="body2"
                      gutterBottom={true}
                    >
                      <LanguageIcon fontSize="small" />
                      <Tooltip title="Website">
                        <Link href={user.website} underline="hover">
                          {user.website}
                        </Link>
                      </Tooltip>
                    </Typography>
                  )}

                  {typeof affiliation === "string" && (
                    <Typography
                      component="p"
                      variant="body2"
                      gutterBottom={true}
                    >
                      <BusinessIcon fontSize="small" />
                      <Tooltip title="Affiliation">
                        <Link href={affiliation} underline="hover">
                          {affiliation}
                        </Link>
                      </Tooltip>
                    </Typography>
                  )}
                  {typeof github === "string" && (
                    <Typography
                      component="p"
                      variant="body2"
                      gutterBottom={true}
                    >
                      <GitHubIcon fontSize="small" />
                      <Tooltip title="GitHub">
                        <Link
                          href={
                            github.includes("github.com")
                              ? github
                              : "https://github.com/" + github
                          }
                          underline="hover"
                        >
                          @
                          {github.includes("github.com")
                            ? github.replace(/\/$/, "").split("/").pop()
                            : github}
                        </Link>
                      </Tooltip>
                    </Typography>
                  )}
                  {typeof bitbucket === "string" && (
                    <Typography
                      component="p"
                      variant="body2"
                      gutterBottom={true}
                    >
                      <BitBucketIcon fontSize="small" />
                      <Tooltip title="BitBucket">
                        <Link
                          href={
                            bitbucket.includes("bitbucket.org")
                              ? bitbucket
                              : "https://bitbucket.org/" + bitbucket
                          }
                          underline="hover"
                        >
                          @
                          {bitbucket.includes("bitbucket.org")
                            ? bitbucket.replace(/\/$/, "").split("/").pop()
                            : bitbucket}
                        </Link>
                      </Tooltip>
                    </Typography>
                  )}
                  {typeof twitter === "string" && (
                    <Typography
                      component="p"
                      variant="body2"
                      gutterBottom={true}
                    >
                      <TwitterIcon fontSize="small" />
                      <Tooltip title="Twitter">
                        <Link
                          href={
                            twitter.includes("twitter.com")
                              ? twitter
                              : "https://twitter.com/" + twitter
                          }
                          underline="hover"
                        >
                          @
                          {twitter.includes("twitter.com")
                            ? twitter.replace(/\/$/, "").split("/").pop()
                            : twitter}
                        </Link>
                      </Tooltip>
                    </Typography>
                  )}
                  {typeof incf === "string" && (
                    <Typography
                      component="p"
                      variant="body2"
                      gutterBottom={true}
                    >
                      <GroupIcon fontSize="small" />
                      <Tooltip title="INCF">
                        <Link href={incf} underline="hover">
                          INCF
                        </Link>
                      </Tooltip>
                    </Typography>
                  )}
                  {typeof orcid === "string" && (
                    <Typography
                      component="p"
                      variant="body2"
                      gutterBottom={true}
                    >
                      <GroupIcon fontSize="small" />
                      <Tooltip title="ORCID">
                        <Link href={orcid} underline="hover">
                          ORCID
                        </Link>
                      </Tooltip>
                    </Typography>
                  )}
                  {Object.keys(otherProfiles)
                    .filter((k) => otherProfiles[k] !== "")
                    .map((k) => (
                      <Typography
                        key={k}
                        component="p"
                        variant="body2"
                        gutterBottom={true}
                      >
                        <LinkIcon fontSize="small" />
                        <Tooltip title={k.charAt(0).toUpperCase() + k.slice(1)}>
                          <Link href={otherProfiles[k]} underline="hover">
                            {k.charAt(0).toUpperCase() + k.slice(1)}
                          </Link>
                        </Tooltip>
                      </Typography>
                    ))}
                </Box>
              )}

              {user.groups && user.groups.length > 0 && (
                <Box className="groups" width="100%">
                  <Typography component="h2" variant="h5" gutterBottom={true}>
                    Groups
                  </Typography>
                  {user.groups &&
                    user.groups.map((group, index) => {
                      return (
                        <Chip
                          className={index === 0 ? "first-chip" : ""}
                          color="secondary"
                          label={group}
                          key={group}
                          variant="outlined"
                          onClick={() => onGroupClick(group)}
                        />
                      );
                    })}
                </Box>
              )}

              {
                canEdit &&
                <Box
                  display="flex"
                  flexDirection="column"
                  width="100%"
                >
                  <Typography component="h2" variant="h5">
                    Maximum quotas
                    <Tooltip
                     title={
                      <span>These are the maximum quotas assigned to your account. If you want more information or increase your quotas, please contact <strong>info@opensourcebrain.org</strong> </span>
                     }
                  >
                    <IconButton
                      sx={{
                        padding: "0 0 0 10px",
                        "&:hover": {
                          background: "transparent",
                        },
                        "& .MuiSvgIcon-root": {
                          color: paragraph,
                          width: 16,
                          height: 16,
                        }
                      }}>
                      <InfoOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  </Typography>

                  {
                    Object.keys(user.quotas).map((row, index) =>
                      USER_QUOTAS[row] &&  <Box display='flex' alignItems='center' justifyContent='space-between' mb='4px'>
                        <Tooltip title={<span><strong>{USER_QUOTAS[row].label}:</strong> {USER_QUOTAS[row]?.description}</span>}>
                          <Typography
                            component="p"
                            variant="subtitle2"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              lineHeight: "1.429",
                              maxWidth: "75%",
                              cursor: "default"
                            }}
                          >
                            {
                              USER_QUOTAS[row].label
                            }
                          </Typography>
                        </Tooltip>
                        <Typography
                          component="p"
                          variant="subtitle2"
                        >
                          {user.quotas[row]} {USER_QUOTAS[row].showGB && "GB"}
                        </Typography>
                      </Box>)
                    }
                    {canEdit && (
                      <Button
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          textTransform: "capitalize",
                          padding: "10px 0 0 0",
                          textAlign: "left",
                          "&:hover": { backgroundColor: "transparent" },
                        }}
                        endIcon={<OpenInNewIcon />}
                        onClick={() => navigateToNotebookNamedServerLink()}
                      >
                        Manage running workspaces
                      </Button>
                    )}
                </Box>
              }


              {user.registrationDate && (
                <Typography component="p" variant="body1">
                  Member since{" "}
                  {user.registrationDate.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid
            item={true}
            sm={8}
            lg={9}
            className={`verticalFit`}
            sx={styles.repositoriesAndWorkspaces}
          >
            <Box
              bgcolor={bgDarkest}
              px={(theme) => theme.spacing(4)}
              sx={{ borderBottom: `1px solid ${lineColor}` }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                aria-label="tabs"
                variant="standard"
              >
                <Tab
                  label={
                    <>
                      Public Workspaces
                      <Chip
                        size="small"
                        color="primary"
                        label={publicWorkspaces.length}
                      />
                    </>
                  }
                  {...a11yProps(0)}
                />
                {canEdit && (
                  <Tab
                    label={
                      <>
                        Private Workspaces
                        <Chip
                          size="small"
                          color="primary"
                          label={privateWorkspaces.length}
                        />
                      </>
                    }
                    {...a11yProps(1)}
                  />
                )}
                <Tab
                  label={
                    <>
                      Repositories
                      <Chip
                        size="small"
                        color="primary"
                        label={repositories.length}
                      />
                    </>
                  }
                  {...a11yProps(2)}
                />
              </Tabs>
            </Box>
            <Box className="scrollbar" height="100%" py={4} pl={4}>
              <TabPanel value={tabValue} index={0}>
                <Grid container={true} spacing={1}>
                  {publicWorkspaces.map((ws) => {
                    return (
                      <Grid
                        item={true}
                        key={ws.id}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={3}
                      >
                        <WorkspaceCard
                          workspace={ws}
                          user={currentUser}
                          handleWorkspaceClick={(workspace: Workspace) =>
                            openWorkspaceUrl(workspace.id)
                          }
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </TabPanel>

              {canEdit && (
                <TabPanel value={tabValue} index={1}>
                  <Grid container={true} spacing={2}>
                    {privateWorkspaces.map((ws) => {
                      return (
                        <Grid
                          item={true}
                          key={ws.id}
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={3}
                        >
                          <WorkspaceCard
                            workspace={ws}
                            user={currentUser}
                            handleWorkspaceClick={(workspace: Workspace) =>
                              openWorkspaceUrl(workspace.id)
                            }
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </TabPanel>
              )}

              <TabPanel
                value={tabValue}
                index={
                  currentUser &&
                  (currentUser.id === user.id || currentUser.isAdmin)
                    ? 2
                    : 1
                }
              >
                <RepositoriesTable
                  handleRepositoryClick={(repository: OSBRepository) =>
                    openRepoUrl(repository.id)
                  }
                  user={currentUser}
                  repositories={repositories}
                  loading={loading}
                />
              </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {canEdit && profileEditDialogOpen && (

        <UserEditor
          user={{ ...user, email: user.email || currentUser.email }}
          saveUser={handleUpdateUser}
          close={() => setProfileEditDialogOpen(false)}
        />
      )}
      {loading && <CircularProgress size={24} />}
    </>
  );
};
