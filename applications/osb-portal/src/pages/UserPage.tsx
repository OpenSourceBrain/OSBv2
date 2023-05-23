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
import {Quotas} from "./GroupsPage";
import {UserPageLayout} from "../components/user/UserPageLayout";

const styles = {
  profileInformation: (theme) => ({
    flexDirection: "column",
    backgroundColor: bgDarker,
    borderRight: `1px solid ${lineColor}`,
    paddingRight: theme.spacing(3),
    overflowY: 'auto',
    maxHeight: "100%",

  "&::-webkit-scrollbar": {
      display: 'none',
      width: 0
    },

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
  return (
    <UserPageLayout>
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
                    <WorkspaceCard workspace={ws} user={currentUser} />
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
                      <WorkspaceCard workspace={ws} user={currentUser} />
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
    </UserPageLayout>
  );
};
