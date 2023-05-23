import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import LinkIcon from "@mui/icons-material/Link";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import GroupIcon from "@mui/icons-material/Group";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import {BitBucketIcon, CodeBranchIcon} from "../components/icons";
import BusinessIcon from "@mui/icons-material/Business";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import Tooltip from "@mui/material/Tooltip";

import { Workspace } from "../types/workspace";
import {OSBRepository, RepositoryContentType} from "../apiclient/workspaces";
import workspaceService from "../service/WorkspaceService";
import WorkspaceCard from "../components/workspace/WorkspaceCard";
import RepositoryService from "../service/RepositoryService";
import {
  bgDarkest,
  bgLightestShade,
  bgDarker,
  linkColor,
  paragraph,
  textColor,
  bgLightest as lineColor,
} from "../theme";

import OSBDialog from "../components/common/OSBDialog";
import UserEditor from "../components/user/UserEditor";
import { User } from "../apiclient/accounts";
import { getUser, updateUser } from "../service/UserService";
import { UserInfo } from "../types/user";

import RepositoriesTable from "../components/repository/RespositoriesTable";
import {StyledShowMoreText, StyledTableContainer} from "../components/styled/Tables";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {StyledContextChip} from "./Repositories/RepositoriesCards";
import TableContainer from "@mui/material/TableContainer";

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

export const Quotas = {
  "quota-ws-maxcpu": {
    label: "Maximum CPU",
    showGB: false
  },
  "quota-ws-maxmem": {
    label: "Maximum memory",
    showGB: true
  },
  "quota-ws-max": {
    label: "Maximum workspaces",
    showGB: false
  },
  "quota-ws-open": {
    label: "Concurrent workspaces",
    showGB: false
  },
  "quota-ws-storage-max": {
    label: "Available storage per workspace",
    showGB: true
  },
  "quota-storage-max": {
    label: "User shared storage",
    showGB: true
  }
}

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
export const GroupsPage = (props: any) => {
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

  const handleSeeMore = (exp: boolean) => {
    setExpanded(!expanded);
  };

  React.useEffect(() => {
    getUser(userName).then((u) => {
      setUser(u);

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
        setUser(updatedUser);
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
  const canEdit =
    currentUser && (currentUser.id === user.id || currentUser.isAdmin);

  console.log(user)


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

              {(user.profiles || user.website) && (
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
                        />
                      );
                    })}
                </Box>
              )}

              <Box
                display="flex"
                flexDirection="column"
                width="100%"
              >
                <Typography component="h2" variant="h5" gutterBottom={true}>
                  Quotas
                </Typography>
                {
                  Object.keys(user.quotas).map((row, index) =>
                    <Box display='flex' alignItems='center' justifyContent='space-between' mb='2px'>
                      <Typography
                        component="p"
                        variant="subtitle2"
                      >
                        {
                          Quotas[row].label
                        }
                      </Typography>
                      <Typography
                        component="p"
                        variant="subtitle2"
                      >
                        {user.quotas[row]}
                      </Typography>
                  </Box>)
                }
              </Box>
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
                      Members
                      <Chip
                        size="small"
                        color="primary"
                        label={4}
                      />
                    </>
                  }
                  {...a11yProps(0)}
                />
              </Tabs>
            </Box>
            <Box className="scrollbar" height="100%" py={4}>
              <TabPanel value={tabValue} index={0}>
                <TableContainer>
                  <Table aria-label="spanning table">
                    <TableBody>

                      <TableRow>
                        <TableCell component="th" scope="row">
                        <Stack spacing={2} direction="row" alignItems="center">
                            <Stack>
                              <Avatar sx={{width: '50px', height: '50px'}}>W</Avatar>
                            </Stack>
                            <Stack sx={{ minWidth: 0 }}>
                              <Typography component="h5" variant="subtitle2" color='secondary'>
                                Afonso Pinto
                              </Typography>
                              <Typography
                                className="username"
                                component="p"
                                variant="subtitle2"
                              >
                                @afonsobspinto
                              </Typography>
                            </Stack>
                          </Stack>
                        </TableCell>

                        <TableCell style={{ width: 300 }} align="right">
                          <Typography display="flex" flexDirection="row" color={paragraph}>
                            <Stack spacing={1} direction="row" alignItems="center">
                              <FolderOpenIcon fontSize="small" />
                              <span>4 workspaces</span>
                            </Stack>

                            <Stack spacing={1} direction="row" alignItems="center">
                              <FiberManualRecordIcon sx={styles.dot} fontSize="small" />
                              <AccountTreeOutlinedIcon fontSize="small" />
                              <span>4 repositories</span>
                            </Stack>
                          </Typography>
                        </TableCell>


                        <TableCell style={{ width: 150 }} align="right">
                          <Button
                            variant="outlined"
                            color='secondary'
                            sx={{
                              borderRadius: '8px',
                              border: '1px solid #fff'
                            }}
                          >
                            <Typography component="h5" variant="subtitle2" color='secondary'>
                              See Profile
                            </Typography>
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {canEdit && profileEditDialogOpen && (

        <UserEditor
          user={user}
          saveUser={handleUpdateUser}
          close={() => setProfileEditDialogOpen(false)}
        />
      )}
      {loading && <CircularProgress size={24} />}
    </>
  );
};
