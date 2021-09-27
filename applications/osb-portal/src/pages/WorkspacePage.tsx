import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router-dom";
import MainMenu from "../components/menu/MainMenu";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import AppsIcon from "@material-ui/Icons/Apps";
import PersonIcon from "@material-ui/Icons/Person";
import CalendarTodayIcon from "@material-ui/Icons/CalendarToday";

import { OSBSplitButton } from "../components/common/OSBSpliButton";
import theme, { bgLight, bgRegular, paragraph } from "../theme";
import WorkspaceService from "../service/WorkspaceService";
import { Workspace, WorkspaceResource } from "../types/workspace";
import OSBDialog from "../components/common/OSBDialog";
import { WorkspaceEditor } from "../components";
import WorkspaceInteractions from "../components/workspace/drawer/WorkspaceInteractions";

const useStyles = makeStyles(() => ({
  workspaceToolbar: {
    cursor: 'pointer',
    padding: theme.spacing(1),
    '& .MuiGrid-root': {
        marginRight: '10px',
    },
  },
  workspaceInformation: {
    '& h1': {
        fontSize: '24px',
        fontWeight: '400',
        marginBottom: theme.spacing(2),
    },
    '& .MuiBox-root': {
        color: paragraph,
        marginBottom: theme.spacing(2),
    },
    '& span': {
        display: 'flex',
        alignItems: 'center',
    },
    '& .MuiTypography-root:nth-child(2)': {
        marginLeft: theme.spacing(1),
    },
    '& .MuiChip-root': {
        backgroundColor: '#3c3c3c',
    },
  },
  workspaceResourcesInformation: {
    '& .MuiAccordion-root': {
        position: 'fixed',
        maxWidth: '20vw',
        borderRadius: 0,
    },
  },
  workspaceDescriptionBox: {
    '& .MuiTypography-root': {
        width: '50%',
        textAlign: 'center',
        marginBottom: theme.spacing(1),
        paddingBottom: theme.spacing(2),
        borderBottom: `solid 1px ${bgLight}`,
    },
    '& img': {
        marginTop: theme.spacing(1),
        minHeight: '200px',
    },
  },
}));

export const WorkspacePage = (props: any) => {

    const classes = useStyles();
    const history = useHistory();
    const { workspaceId } = useParams<{ workspaceId: string}>();
    const [workspace, setWorkspace] = React.useState<Workspace>();
    const [editWorkspaceOpen, setEditWorkspaceOpen] = React.useState(false);
    const [refresh, setRefresh] = React.useState(true);

    React.useEffect(() => {
        WorkspaceService.getWorkspace(parseInt(workspaceId, 10)).then((ws) => {
            setWorkspace(ws);
        });
    }, [refresh]);

    const handleCloseEditWorkspace = () => {
        setEditWorkspaceOpen(false);
    }

    const handleResourceClick = (resource: WorkspaceResource) => {
        openWithApp(resource.type.application.name);
    }

    const OPEN_NWB = 'OPEN WITH NWB EXPLORER';
    const OPEN_JUPYTER = 'OPEN WITH JUPYTER HUB';
    const OPEN_NETPYNE = 'OPEN WITH NETPYNE';
    const options = [OPEN_NWB, OPEN_JUPYTER, OPEN_NETPYNE];

    const openWithApp = (selectedOption: string) => {
        let app;
        switch (selectedOption) {
            case OPEN_NETPYNE:
                app = 'netpyne';
                break;
            case OPEN_JUPYTER:
                app = 'jupyter';
                break;
            default:
                app = 'nwbexplorer'
                break;
        }
        history.push(`/workspace/open/${workspaceId}/${app}`);
    }

    return (
    <Box className="verticalFit">
        { workspace && <>
        <Box className="wrapper-for-now">
            <Divider />
            <MainMenu />
            <Divider />

            <Box display="flex" alignItems="center" justifyContent="space-between" bgcolor={bgLight} className={classes.workspaceToolbar}>
                <Box display="flex" onClick={() => history.push('/')}>
                    <AppsIcon color="primary" fontSize="small" />
                    <Typography component="span" color="primary">See all workspaces</Typography>
                </Box>

                <Box display="flex">
                    {props.user && props.user.id === workspace.userId && <Button variant="outlined" disableElevation={true} color="secondary" style={{ borderColor: 'white' }} onClick={() => setEditWorkspaceOpen(true)}>
                        Edit
                    </Button>}
                    <OSBSplitButton options={options} handleClick={openWithApp} />
                </Box>
            </Box>

            <Box bgcolor={bgRegular} minHeight="20vh" display="flex" alignItems="center" justifyContent="center" flexDirection="column" p={1} className={classes.workspaceInformation}>
                <Typography component="h1">{workspace.name}</Typography>
                <Box display="flex" flexDirection="row">
                    {(workspace.owner && (workspace.owner.firstName || workspace.owner.lastName)) ? <Typography component="span" variant="body2"><PersonIcon fontSize="small" /> By {workspace.owner.firstName + ' ' + workspace.owner.lastName}</Typography> : null}
                    {workspace.timestampUpdated && <Typography component="span" variant="body2"><CalendarTodayIcon fontSize="small" /> Last Updated on {workspace.timestampUpdated.toDateString()}</Typography>}
                </Box>
                <Box>{workspace.tags && workspace.tags.map(tagObject => { return <Chip size="small" label={tagObject.tag} key={tagObject.id}/>})}</Box>
            </Box>
            <Divider />
        </Box>

        <Box className={`verticalFit ${classes.workspaceResourcesInformation}`} display="flex" flexDirection="row">
            <WorkspaceInteractions workspace={workspace} open={true} user={props.user} refreshWorkspace={() => {setRefresh(!refresh)}} openResource={handleResourceClick} />
            <Box className={`${classes.workspaceDescriptionBox} scrollbar`} width="100vw" display="flex" flexDirection="column" alignItems="center" p={1}>
                <Typography component="p" variant="body1">{workspace.description}</Typography>
                {workspace.thumbnail ? <img src={`/proxy/workspaces/${workspace.thumbnail}?v=${workspace.timestampUpdated.getMilliseconds()}`}/> : null}
            </Box>
        </Box>

        {<OSBDialog
            title={"Edit workspace " + workspace.name}
            open={editWorkspaceOpen}
            closeAction={handleCloseEditWorkspace}
        >
            <WorkspaceEditor workspace={workspace} onLoadWorkspace={handleCloseEditWorkspace} />
        </OSBDialog>}
        </>}
    </Box>
    )
}

export default WorkspacePage;