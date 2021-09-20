import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router-dom";
import MainMenu from "../components/menu/MainMenu";
import Box from "@material-ui/core/Box";
import AppsIcon from "@material-ui/Icons/Apps";
import PersonIcon from "@material-ui/Icons/Person";
import CalendarTodayIcon from "@material-ui/Icons/CalendarToday";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { OSBSplitButton } from "../components/common/OSBSpliButton";
import theme, { bgLight, bgRegular } from "../theme";
import WorkspaceService from "../service/WorkspaceService";
import { Workspace } from "../types/workspace";
import Chip from "@material-ui/core/Chip";
import { Divider } from "@material-ui/core";

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
  },
  workspaceResourcesInformation: {

  },
}));

export const WorkspacePage = (props: any) => {

    const classes = useStyles();
    const history = useHistory();
    const { workspaceId } = useParams<{ workspaceId: string}>();
    const [workspace, setWorkspace] = React.useState<Workspace>();
    console.log('the workspace', workspace);
    if (workspace) {
        console.log('timestamp updated', workspace.timestampUpdated);
    }

    React.useEffect(() => {
        WorkspaceService.getWorkspace(parseInt(workspaceId, 10)).then((ws) => {
            setWorkspace(ws);
        });
    }, []);

    console.log('all props', props);

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
                <Button variant="outlined" disableElevation={true} color="secondary" style={{ borderColor: 'white' }}>
                    Edit
                </Button>
                <OSBSplitButton options={options} handleClick={openWithApp} />
            </Box>
        </Box>
        <Box className={classes.workspaceInformation}>
            <Typography component="h1">My Workspace</Typography>
            { workspace && <Box>
                {workspace.owner && <PersonIcon>By {workspace.owner.firstName + ' ' + workspace.owner.lastName}</PersonIcon>}
                {workspace.timestampUpdated && <CalendarTodayIcon>Last Updated on {workspace.timestampUpdated}</CalendarTodayIcon>}
                {workspace.tags && workspace.tags.map(tagObject => { return <Chip size="small" label={tagObject.tag} key={tagObject.id}/>})}
            </Box>}
        </Box>
        <Box className="verticalFill">
            <Box>
                {workspace ? workspace.description : null}
                <Divider />

            </Box>

        </Box>
    </Box>
}

export default WorkspacePage;