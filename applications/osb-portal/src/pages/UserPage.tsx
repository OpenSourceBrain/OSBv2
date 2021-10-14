import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from '@material-ui/core/Typography';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MainMenu from "../components/menu/MainMenu";
import LinkIcon from "@material-ui/icons/Link";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import GitHubIcon from "@material-ui/icons/GitHub";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import {BitBucketIcon} from "../components/icons";
import { bgDarkest, bgRegular, linkColor, paragraph, textColor } from "../theme";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { Workspace } from "../types/workspace";
import { OSBRepository } from "../apiclient/workspaces";
import workspaceService from "../service/WorkspaceService";
import WorkspaceCard from "../components/workspace/WorkspaceCard";
import Grid from "@material-ui/core/Grid";
import RepositoryService from "../service/RepositoryService";
import Paper from "@material-ui/core/Paper";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ShowMoreText from "react-show-more-text";
import MarkdownViewer from "../components/common/MarkdownViewer";
import Avatar from "@material-ui/core/Avatar";



const useStyles = makeStyles((theme) => ({
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
    const [repositories, setRepositories] = React.useState<OSBRepository[]>([]);
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
        workspaceService.fetchWorkspaces().then((workspacesRetrieved) => {
            setWorkspaces(workspacesRetrieved.items);
        });
        RepositoryService.getRepositories(1).then((repositoriesRetrieved) => {
            setRepositories(repositoriesRetrieved);
        })
    }, [])

    const exampleData = {
        firstName: 'Padraig',
        lastName: 'Gleeson',
        username: 'pglesson',
        numRepositories: 16,
        numWorkspaces: 4,
        webisteLink: 'http://www.neuroconstruct.org',
        githubLink: 'https://github.com/',
        bitbucketLink: 'https://github.com/',
        profileLink: 'https://github.com/',
        group1: "OpenWorm",
        group2: "SilverLab",
        profileImageUrl: '',
        memberSince: 'March 21st 2011',
    }

    return (
        <Box className="verticalFit">

            <MainMenu />

            <Box bgcolor={bgDarkest} className="verticalFill" width="100vw" display="flex" justifyContent="center">
                <Box width="80%" display="flex" flexDirection="row" justifyContent="space-around">

                    <Box className={classes.profileInformation} width="30%" display="flex" alignItems="flex-start" flexDirection="column" height="100%" color={paragraph}>
                        <Avatar alt="user-profile-avatar" src={exampleData.profileImageUrl}>
                            {exampleData.firstName.charAt(0) + exampleData.lastName.charAt(0)}
                        </Avatar>
                        <Typography className="name" component="span" variant="h3">{exampleData.firstName + " " + exampleData.lastName}</Typography>
                        <Typography className="username" component="p" variant="body2">{exampleData.username}</Typography>
                        {props.user && <Button variant="outlined" color="primary">Edit My Profile</Button>}

                        <Box display="flex" flexDirection="row"><AccountTreeOutlinedIcon fontSize="small" /> {exampleData.numRepositories} repositories . <FolderOpenIcon fontSize="small"/>{exampleData.numWorkspaces} workspaces</Box>

                        <Box className="links" display="flex" flexDirection="column" width="100%">
                            <Typography component="p" variant="body2" gutterBottom={true}><LinkIcon fontSize="small"/><Link href={exampleData.webisteLink}>{exampleData.webisteLink}</Link></Typography>
                            <Typography component="p" variant="body2" gutterBottom={true}><LinkIcon fontSize="small"/><Link href={exampleData.profileLink}>INCF Profile</Link></Typography>
                            <Typography component="p" variant="body2" gutterBottom={true}><GitHubIcon fontSize="small"/><Link href={exampleData.githubLink}>Github Profile</Link></Typography>
                            <Typography component="p" variant="body2" gutterBottom={true}><BitBucketIcon fontSize="small"/><Link href={exampleData.bitbucketLink}>Bitbucket profile</Link></Typography>
                        </Box>

                        <Box className="groups" width="100%">
                            <Typography component="p" variant="h5" gutterBottom={true}>Groups</Typography>
                            <Chip className="first-chip" color="secondary" label={exampleData.group1} variant="outlined"/>
                            <Chip label={exampleData.group2} variant="outlined"/>
                        </Box>

                        <Typography component="p" variant="body2">Member since {exampleData.memberSince}</Typography>
                    </Box>

                    <Box className={classes.repositoriesAndWorkspaces} width="60%" height="100%" display="flex" justifyContent="flex-start" flexDirection="column">
                        <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary" aria-label="tabs">
                            <Tab label="WORKSPACES" {...a11yProps(0)} />
                            <Tab label="REPOSITORIES" {...a11yProps(1)} />
                        </Tabs>

                        <Box className="scrollbar" height="100%">
                            <TabPanel value={tabValue} index={0}>
                                <Grid container={true} spacing={1}>
                                    {workspaces.map(ws => {
                                        return (
                                            <Grid item={true} key={ws.id} xs={6} sm={4} md={6} lg={4} xl={3} >
                                                <WorkspaceCard workspace={ws} />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </TabPanel>

                            <TabPanel value={tabValue} index={1}>
                                {repositories.map(repo => {
                                    return (
                                        <Paper key={repo.id}>
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
        </Box>
    )
}