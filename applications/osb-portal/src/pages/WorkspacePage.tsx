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
import { Workspace } from "../types/workspace";
import OSBDialog from "../components/common/OSBDialog";
import { WorkspaceEditor } from "../components";


const useStyles = makeStyles(() => ({
  workspaceToolbar: {
    backgroundColor: bgLight,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    '& .MuiTypography-root': {
        cursor: 'pointer',
    },
    '& .MuiGrid-root': {
        marginRight: '10px',
    },
  },
  workspaceInformation: {
    backgroundColor: bgRegular,
    minHeight: '30%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(1),
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
  },
}));

export const WorkspacePage = (props: any) => {

    const classes = useStyles();
    const history = useHistory();
    const { workspaceId } = useParams<{ workspaceId: string}>();
    const [workspace, setWorkspace] = React.useState<Workspace>();
    const [editWorkspaceOpen, setEditWorkspaceOpen] = React.useState(false);

    console.log('the workspace', workspace);
    console.log('props', props);
    if (workspace) {
        console.log('timestamp updated', workspace.timestampUpdated);
    }

    React.useEffect(() => {
        WorkspaceService.getWorkspace(parseInt(workspaceId, 10)).then((ws) => {
            setWorkspace(ws);
        });
    }, []);

    const handleCloseEditWorkspace = () => {
        setEditWorkspaceOpen(false);
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

    return <Box className="verticalFill">
        <MainMenu />
        <Box className={classes.workspaceToolbar}>
            <Box display="flex">
              <AppsIcon color="primary" fontSize="small" onClick={() => history.goBack()} />
              <Typography component="h1" color="primary">
                <Typography component="span" onClick={history.goBack}>See all workspaces</Typography>
              </Typography>
            </Box>
            <Box display="flex">
                {workspace && props.user && props.user.id === workspace.userId && <Button variant="outlined" disableElevation={true} color="secondary" style={{ borderColor: 'white' }} onClick={() => setEditWorkspaceOpen(true)}>
                    Edit
                </Button>}
                <OSBSplitButton options={options} handleClick={openWithApp} />
            </Box>
        </Box>
        <Box className={classes.workspaceInformation}>
            {workspace ? <Typography component="h1">{workspace.name}</Typography> : null}
            { workspace && <Box display="flex" flexDirection="row">
                {(workspace.owner && (workspace.owner.firstName || workspace.owner.lastName)) ? <Typography component="span" variant="body2"><PersonIcon fontSize="small" /> By {workspace.owner.firstName + ' ' + workspace.owner.lastName}</Typography> : null}
                {workspace.timestampUpdated && <Typography component="span" variant="body2"><CalendarTodayIcon fontSize="small" /> Last Updated on {workspace.timestampUpdated.toDateString()}</Typography>}
                {workspace.timestampUpdated && <Typography component="span" variant="body2"><CalendarTodayIcon fontSize="small" /> Last Updated on {workspace.timestampUpdated.toDateString()}</Typography>}
            </Box>}
            <Box>{workspace && workspace.tags && workspace.tags.map(tagObject => { return <Chip size="small" label={tagObject.tag} key={tagObject.id}/>})}</Box>
        </Box>
        <Box className="verticalFill">
            <Box>
                {workspace ? workspace.description : null}
                <Divider />

            </Box>

        </Box>
        {workspace && <OSBDialog
            title={"Edit workspace " + workspace.name}
            open={editWorkspaceOpen}
            closeAction={handleCloseEditWorkspace}
        >
            <WorkspaceEditor workspace={workspace} onLoadWorkspace={handleCloseEditWorkspace} />
        </OSBDialog>}
    </Box>
}

export default WorkspacePage;