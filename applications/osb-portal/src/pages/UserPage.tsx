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
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import { BitBucketIcon } from "../components/icons";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ShowMoreText from "react-show-more-text";

import MarkdownViewer from "../components/common/MarkdownViewer";
import MainMenu from "../components/menu/MainMenu";
import { Workspace } from "../types/workspace";
import { OSBRepository } from "../apiclient/workspaces";
import workspaceService from "../service/WorkspaceService";
import WorkspaceCard from "../components/workspace/WorkspaceCard";
import RepositoryService from "../service/RepositoryService";
import { bgDarkest, bgLightestShade, bgRegular, linkColor, paragraph, textColor } from "../theme";
import Divider from "@material-ui/core/Divider";
import OSBDialog from "../components/common/OSBDialog";
import UserEditor from "../components/user/UserEditor";
import { User } from "../apiclient/accounts";
import { getUser } from "../service/UserService";


const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiDivider-root': {
            position: 'fixed',
            top: '145px',
            width: '100%',
            height: '2px',
        },
    },
    profileInformation: {
        paddingTop: '10px',
        '& .MuiSvgIcon-root': {
            marginRight: '5px',
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
        paddingTop: '50px',
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
                    <Typography>{children}</Typography>
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

export const UserPage = (props: any) => {
    const [tabValue, setTabValue] = React.useState(0);
    const [expanded, setExpanded] = React.useState(false);
    const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);
    const [profileEditDialogOpen, setProfielEditDialogOpen] = React.useState(false);
    const [repositories, setRepositories] = React.useState<OSBRepository[]>([]);
    const [user, setUser] = React.useState<User>(null);
    const classes = useStyles();
    const history = useHistory();
    const { userId } = useParams<{ userId: string }>();

    const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
        setTabValue(newTabValue);
    }

    const handleSeeMore = (exp: boolean) => {
        setExpanded(!expanded);
    }

    React.useEffect(() => {
        getUser(userId).then(u => {setUser(u) ; console.log('the user', user)}).catch(e => console.log('error from user', e))
        workspaceService.fetchWorkspaces().then((workspacesRetrieved) => {
            setWorkspaces(workspacesRetrieved.items);
        });
        RepositoryService.getRepositories(1).then((repositoriesRetrieved) => {
            setRepositories(repositoriesRetrieved);
        })
    }, []);

    return user && (
        <Box className="verticalFit">

            <MainMenu />

            <Box bgcolor={bgDarkest} className={`${classes.root} verticalFill`} width="100vw" display="flex" justifyContent="center">
                <Divider light={true} variant="fullWidth"/>
                <Box width="80%" display="flex" flexDirection="row" justifyContent="space-around">

                    <Box className={classes.profileInformation} width="30%" display="flex" alignItems="flex-start" flexDirection="column" height="100%" color={paragraph}>
                        <Avatar alt="user-profile-avatar" src={user.avatar}>
                            {user.firstName.charAt(0) + user.lastName.charAt(0)}
                        </Avatar>
                        <Typography className="name" component="span" variant="h3">{user.firstName + " " + user.lastName}</Typography>
                        <Typography className="username" component="p" variant="body2">{user.username}</Typography>
                        {false && <Button variant="outlined" color="primary" onClick={() => setProfielEditDialogOpen(true)}>Edit My Profile</Button>}

                        <Box display="flex" flexDirection="row">
                            {repositories ? <><AccountTreeOutlinedIcon fontSize="small" />{repositories.length} .</> : <CircularProgress size="1rem" />}
                            {workspaces ? <><FolderOpenIcon fontSize="small" />{workspaces.length} </> : <CircularProgress size="1rem" />}
                        </Box>
                        <Box className="links" display="flex" flexDirection="column" width="100%">
                            <Typography component="p" variant="body2" gutterBottom={true}><LinkIcon fontSize="small"/><Link href={user.website}>{user.website}</Link></Typography>
                            {/* <Typography component="p" variant="body2" gutterBottom={true}><LinkIcon fontSize="small"/><Link href={user.profileLink}>INCF Profile</Link></Typography>
                            <Typography component="p" variant="body2" gutterBottom={true}><GitHubIcon fontSize="small"/><Link href={user.githubLink}>Github Profile</Link></Typography>
                            <Typography component="p" variant="body2" gutterBottom={true}><BitBucketIcon fontSize="small"/><Link href={user.bitbucketLink}>Bitbucket profile</Link></Typography> */}
                        </Box>

                        {user.groups && <Box className="groups" width="100%">
                            <Typography component="p" variant="h5" gutterBottom={true}>Groups</Typography>
                            { user.groups && user.groups.map((group, index) => {
                                return <Chip className={index === 0 ? "first-chip" : ''} color="secondary" label={group} key={group} variant="outlined"/>
                            })}
                        </Box>}

                        <Typography component="p" variant="body2">Member since {user.memberSince}</Typography>
                    </Box>

                    <Box className={classes.repositoriesAndWorkspaces} width="65%" height="100%" display="flex" justifyContent="flex-start" flexDirection="column">
                        <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary" aria-label="tabs" variant="standard">
                            <Tab label={<Typography component="p" variant="body1">WORKSPACES<Chip size="small" color="primary" label={workspaces.length}/></Typography>} {...a11yProps(0)} />
                            <Tab label={<Typography component="p" variant="body1">REPOSITORIES<Chip size="small" color="primary" label={repositories.length}/></Typography>} {...a11yProps(1)} />
                        </Tabs>

                        <Box className="scrollbar" height="100%">
                            <TabPanel value={tabValue} index={0}>
                                <Grid container={true} spacing={1}>
                                    {workspaces.map(ws => {
                                        return (
                                            <Grid item={true} key={ws.id} xs={12} sm={6} md={6} lg={4} xl={4}>
                                                <WorkspaceCard workspace={ws} />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </TabPanel>

                            <TabPanel value={tabValue} index={1}>
                                {repositories.map(repo => {
                                    return (
                                        <Paper className="repo-paper" key={repo.id} elevation={0}>
                                            <Typography component="span" gutterBottom={true}>{repo.name}</Typography>
                                            {repo.description && <Typography component="span" gutterBottom={true}>{repo.description}</Typography>}
                                            {repo.summary &&
                                                <ShowMoreText className={classes.showMoreText} lines={1} more={<>See more <ExpandMoreIcon /></>} less={<>See less <ExpandLessIcon /></>} onClick={handleSeeMore} expanded={expanded}>
                                                    <MarkdownViewer text={repo.summary} />
                                                </ShowMoreText>
                                            }
                                        </Paper>
                                    );
                                })}
                            </TabPanel>
                        </Box>
                    </Box>
                </Box>

            </Box>
            <OSBDialog open={profileEditDialogOpen} title="Edit My Profile" closeAction={() => setProfielEditDialogOpen(false)}>
                <UserEditor closeHandler={() => setProfielEditDialogOpen(false)} />
            </OSBDialog>
        </Box>
    )
}