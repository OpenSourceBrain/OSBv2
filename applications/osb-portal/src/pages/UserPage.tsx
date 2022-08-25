import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles, styled } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from '@material-ui/core/Typography';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinkIcon from "@material-ui/icons/Link";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import GitHubIcon from "@material-ui/icons/GitHub";
import TwitterIcon from '@material-ui/icons/Twitter';
import LanguageIcon from '@material-ui/icons/Language';
import GroupIcon from '@material-ui/icons/Group';
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import { BitBucketIcon } from "../components/icons";
import EmailIcon from "@material-ui/icons/Email";
import BusinessIcon from '@material-ui/icons/Business';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ShowMoreText from "react-show-more-text";
import Tooltip from '@material-ui/core/Tooltip';

import MarkdownViewer from "../components/common/MarkdownViewer";
import { MainMenu } from "../components/index";
import { Workspace } from "../types/workspace";
import { OSBRepository } from "../apiclient/workspaces";
import workspaceService from "../service/WorkspaceService";
import WorkspaceCard from "../components/workspace/WorkspaceCard";
import RepositoryService from "../service/RepositoryService";
import { bgDarkest, bgLightestShade, bgRegular, linkColor, paragraph, textColor } from "../theme";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import OSBDialog from "../components/common/OSBDialog";
import UserEditor from "../components/user/UserEditor";
import { User } from "../apiclient/accounts";
import { getUser, updateUser } from "../service/UserService";


const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    '& .MuiDivider-root': {
      position: 'absolute',
      top: theme.spacing(7),
      width: '100%',
      height: '2px',
    },
  },
  profileInformation: {
    paddingTop: `${theme.spacing(6)}px !important`,
    flexDirection: "column",
    '& .MuiSvgIcon-root': {
      marginRight: '5px',
      color: paragraph,
    },
    '& .MuiAvatar-root': {
      width: '150px',
      height: '150px',
      marginBottom: theme.spacing(2),
    },
    '& .name': {
      color: textColor,
      flex: 'none',
    },
    '& .username': {
      marginBottom: '1.5rem',
    },
    '& .MuiButton-root': {
      width: '100%',
      marginBottom: '1.5rem',
    },
    '& .links': {
      marginTop: '2rem',
      paddingBottom: '2.5rem',
      borderBottom: `2px solid ${bgRegular}`,
      '& .MuiTypography-root': {
        display: 'flex',
      },
    },
    '& .groups': {
      paddingTop: '1rem',
      paddingBottom: '1rem',
      borderBottom: `2px solid ${bgRegular}`,
      marginBottom: '1rem',
      '& .MuiTypography-root': {
        color: textColor,
      },
      '& .MuiChip-root': {
        color: paragraph,
        border: `1px solid ${paragraph}`
      },
      '& .first-chip': {
        marginLeft: 0,
      },
    },
  },
  repositoriesAndWorkspaces: {
    paddingTop: `${theme.spacing(7) - 23}px !important`,
    flexDirection: 'column',
    paddingBottom: "0px !important",
    '& .repo-paper': {
      backgroundColor: bgLightestShade,
      padding: theme.spacing(3),
      marginBottom: theme.spacing(2),
    },
    '& .MuiTabs-root': {
      marginBottom: '15px',
    },
  },
  showMoreText: {
    color: paragraph,
    '& a': {
      color: linkColor,
      display: 'flex',
      textDecoration: 'none',
      '& .MuiSvgIcon-root': {
        color: `${linkColor} !important`,
      },
    },
  },
  dot: {
    height: '5px',
    width: '5px',
    alignSelf: 'center',
    marginLeft: '5px',
  },
  repository: {
    cursor: "pointer"
  }
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index &&
        <Box>
          <Typography component="section">{children}</Typography>
        </Box>
      }
    </div>
  )
}


function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}


const BIG_NUMBER_OF_ITEMS = 1000;
export const UserPage = (props: any) => {
  const [tabValue, setTabValue] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [publicWorkspaces, setPublicWorkspaces] = React.useState<Workspace[]>([]);
  const [allWorkspaces, setAllWorkspaces] = React.useState<Workspace[]>([]);
  const [profileEditDialogOpen, setProfileEditDialogOpen] = React.useState(false);
  const [repositories, setRepositories] = React.useState<OSBRepository[]>([]);
  const [user, setUser] = React.useState<User>(null);
  const classes = useStyles();
  const history = useHistory();
  const { userId } = useParams<{ userId: string }>();
  const [error, setError] = React.useState<any>(null);
  const [formError, setFormError] = React.useState<any>({});
  const [userProfileForm, setUserProfileForm] = React.useState<any>({});
  delete userProfileForm.groups;
  const [loading, setLoading] = React.useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
    setTabValue(newTabValue);
  }

  const handleSeeMore = (exp: boolean) => {
    setExpanded(!expanded);
  }

  React.useEffect(() => {
    getUser(userId).then(u => { setUser(u); setUserProfileForm({ ...u }); });
    workspaceService.fetchWorkspacesByFilter(true, false, 1, { user_id: `${userId}` }, BIG_NUMBER_OF_ITEMS).then((workspacesRetrieved) => {
      setPublicWorkspaces(workspacesRetrieved.items);
    },
    (e) => { setError(e) });
    if (props.user && (props.user.id === userId || props.user.isAdmin)) {
      workspaceService.fetchWorkspacesByFilter(false, false, 1, { user_id: `${userId}` }, BIG_NUMBER_OF_ITEMS).then((workspacesRetrieved) => {
        setAllWorkspaces(workspacesRetrieved.items);
      },
      (e) => { setError(e) });
    }
    RepositoryService.getRepositories(1, BIG_NUMBER_OF_ITEMS, userId).then((repositoriesRetrieved) => {
      setRepositories(repositoriesRetrieved);
    },
    (e) => { setError(e) });
  }, [userId]);

  if (error) {
    throw error;
  }

  if (!user || (user.profiles === undefined)) {
    return null;
  }


  const getPrivateWorkspaces = () => {
    // remove public workspaces from the list of all workspaces
    const privateWorkspaces: Workspace[] = allWorkspaces.filter((ws: Workspace) => {

      const tempWorkspaces: Workspace[] = publicWorkspaces.filter((pws) => {
        return pws.id === ws.id
      });

      if (tempWorkspaces.length > 0) {
        return false;
      }

      return true;
    });

    return privateWorkspaces;
  }

  const openRepoUrl = (repositoryId: number) => {
    history.push(`/repositories/${repositoryId}`);
  }
  /* the keys are stored in lower case */
  const { affiliation, incf, bitbucket, github, twitter, orcid, ...otherProfiles } = (user.profiles as unknown) as { [k: string]: string };

  const handleUpdateUser = (u: User) => {
    setLoading(true);
    setProfileEditDialogOpen(false);
    setUser(u);
    updateUser(userProfileForm).then((updatedUser) => {
      console.log('user should be updated');
      setLoading(false);
      window.location.reload();
    }).catch((err) => {
      setLoading(false);
      console.log('error updating user', err);
      setError({ ...error, general: `An error occurred updating the user. Please try again later.` })
    });

  }

  return (
    <Box className="verticalFit">

      <MainMenu />

      <Box bgcolor={bgDarkest} className={`${classes.root} verticalFill`} width="100vw" display="flex" justifyContent="center">
        <Divider light={true} variant="fullWidth" />
        <Container maxWidth="xl" className="verticalFit">
          <Grid container={true} spacing={6} className="verticalFill" >
            <Grid item={true} sm={4} lg={3} className={`${classes.profileInformation}`} >
              <Avatar alt="user-profile-avatar" src={user.avatar}>
                {(user.firstName.length > 0 && user.firstName.charAt(0)) + (user.lastName.length > 0 && user.lastName.charAt(0))}
              </Avatar>
              <Typography className="name" component="h1" variant="h1">{user.firstName + " " + user.lastName}</Typography>
              <Typography className="username" component="p" variant="body2">{user.username}</Typography>
              {props.user && (props.user.id === user.id || props.user.isAdmin) && <Button variant="outlined" color="primary" onClick={() => setProfileEditDialogOpen(true)}>Edit My Profile</Button>}

              <Box display="flex" flexDirection="row" color={paragraph}>
                {publicWorkspaces ? <><FolderOpenIcon fontSize="small" />{publicWorkspaces.length} workspaces</> : <CircularProgress size="1rem" />}
                {props.user && (props.user.id === user.id || props.user.isAdmin) && allWorkspaces ? <> ({getPrivateWorkspaces().length} private) </> : <> </> }
                {repositories ? <><FiberManualRecordIcon className={classes.dot} fontSize="small" /><AccountTreeOutlinedIcon fontSize="small" />{repositories.length} repositories</> : <CircularProgress size="1rem" />}
              </Box>

              {(user.profiles || user.website) && <Box className="links" display="flex" flexDirection="column" width="100%">
                {typeof user.website === 'string' && user.website && <Typography component="p" variant="body2" gutterBottom={true}><LanguageIcon fontSize="small" /><Tooltip title="Website"><Link href={user.website}>{user.website}</Link></Tooltip></Typography>}

                {typeof affiliation === 'string' &&  <Typography component="p" variant="body2" gutterBottom={true}><BusinessIcon fontSize="small" /><Tooltip title="Affiliation"><Link href={ affiliation }>{ affiliation }</Link></Tooltip></Typography>}
                {typeof github === 'string' && <Typography component="p" variant="body2" gutterBottom={true}><GitHubIcon fontSize="small" /><Tooltip title="GitHub"><Link href={github.includes('github.com') ? github : 'https://github.com/' + github}>@{ github.includes('github.com') ? github.replace(/\/$/, '').split("/").pop() : github }</Link></Tooltip></Typography>}
                {typeof bitbucket === 'string' && <Typography component="p" variant="body2" gutterBottom={true}><BitBucketIcon fontSize="small" /><Tooltip title="BitBucket"><Link href={bitbucket.includes('bitbucket.org') ? bitbucket : 'https://bitbucket.org/' + bitbucket}>@{ bitbucket.includes('bitbucket.org') ? bitbucket.replace(/\/$/, '').split("/").pop() : bitbucket }</Link></Tooltip></Typography>}
                {typeof twitter === 'string' &&  <Typography component="p" variant="body2" gutterBottom={true}><TwitterIcon fontSize="small" /><Tooltip title="Twitter"><Link href={twitter.includes('twitter.com') ? twitter : 'https://twitter.com/' + twitter}>@{ twitter.includes('twitter.com') ? twitter.replace(/\/$/, '').split("/").pop() : twitter }</Link></Tooltip></Typography>}
                {typeof incf === 'string' && <Typography component="p" variant="body2" gutterBottom={true}><GroupIcon fontSize="small" /><Tooltip title="INCF"><Link href={incf}>INCF</Link></Tooltip></Typography>}
                {typeof orcid === 'string' && <Typography component="p" variant="body2" gutterBottom={true}><GroupIcon fontSize="small" /><Tooltip title="ORCID"><Link href={orcid}>ORCID</Link></Tooltip></Typography>}
                {Object.keys(otherProfiles).filter((k) => (otherProfiles[k] !== "")).map(k => <Typography key={k} component="p" variant="body2" gutterBottom={true}><LinkIcon fontSize="small" /><Tooltip title={(k.charAt(0).toUpperCase() + k.slice(1))}><Link href={otherProfiles[k]}>{(k.charAt(0).toUpperCase() + k.slice(1))}</Link></Tooltip></Typography>)}
              </Box>}

              {user.groups && <Box className="groups" width="100%">
                <Typography component="p" variant="h5" gutterBottom={true}>Groups</Typography>
                {user.groups && user.groups.map((group, index) => {
                  return <Chip className={index === 0 ? "first-chip" : ''} color="secondary" label={group} key={group} variant="outlined" />
                })}
              </Box>}

              {user.registrationDate && <Typography component="p" variant="body2">Member since {user.registrationDate.toDateString()}</Typography>}
            </Grid>

            <Grid item={true} sm={8} lg={9} className={`verticalFit ${classes.repositoriesAndWorkspaces}`}>
              <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary" aria-label="tabs" variant="standard">
                <Tab label={<>Public Workspaces<Chip size="small" color="primary" label={publicWorkspaces.length} /></>} {...a11yProps(0)} />
                {props.user && (props.user.id === user.id || props.user.isAdmin) && <Tab label={<>Private Workspaces<Chip size="small" color="primary" label={getPrivateWorkspaces().length} /></>} {...a11yProps(1)} />}
                <Tab label={<>Repositories<Chip size="small" color="primary" label={repositories.length} /></>} {...a11yProps(2)} />
              </Tabs>

              <Box className="scrollbar" height="100%">
                <TabPanel value={tabValue} index={0}>
                  <Grid container={true} spacing={1}>
                    {publicWorkspaces.map(ws => {
                      return (
                        <Grid item={true} key={ws.id} xs={12} sm={6} md={4} lg={4} xl={3}>
                          <WorkspaceCard workspace={ws} />
                        </Grid>
                      );
                    })}
                  </Grid>
                </TabPanel>

                {props.user && (props.user.id === user.id || props.user.isAdmin) &&
                <TabPanel value={tabValue} index={1}>
                  <Grid container={true} spacing={1}>
                    {getPrivateWorkspaces().map(ws => {
                      return (
                        <Grid item={true} key={ws.id} xs={12} sm={6} md={4} lg={4} xl={3}>
                          <WorkspaceCard workspace={ws} />
                        </Grid>
                      );
                    })}
                  </Grid>
                </TabPanel>
                }

                <TabPanel value={tabValue} index={(props.user && (props.user.id === user.id || props.user.isAdmin)) ? 2 : 1}>
                  <Grid container={true} spacing={1}>
                    {repositories.map(repo => {
                      return (
                        <Grid item={true} key={repo.id} xs={12} className={classes.repository} onClick={() => openRepoUrl(repo.id)}>
                          <Paper className="repo-paper" elevation={0}>
                            <Typography component="span" gutterBottom={true}>{repo.name}</Typography>
                            {repo.description && <Typography component="span" gutterBottom={true}>{repo.description}</Typography>}
                            {repo.summary && <MarkdownViewer text={repo.summary} />
                            }
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </TabPanel>
              </Box>
            </Grid>
          </Grid>
        </Container>

      </Box>
      {props.user && (props.user.id === user.id || props.user.isAdmin) && profileEditDialogOpen && <OSBDialog open={true} title="Edit My Profile" closeAction={() => setProfileEditDialogOpen(false)} actions={
          <React.Fragment>
            <Button color="primary" onClick={() => setProfileEditDialogOpen(false)}>Cancel</Button> <Button variant="contained" color="primary" onClick={handleUpdateUser}>Save Changes</Button>
          </React.Fragment>
        } >
        <UserEditor user={user} profileForm={userProfileForm} setProfileForm={setUserProfileForm} error={formError} setError={setFormError}/>
      </OSBDialog>}
      {loading &&
        <CircularProgress
          size={24}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
          }}
        />
      }
    </Box >
  )
}
