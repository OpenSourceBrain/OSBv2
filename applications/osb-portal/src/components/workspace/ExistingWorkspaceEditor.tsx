import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import workspaceService from '../../service/WorkspaceService';
import WorkspaceCard from "../workspace/WorkspaceCard";
import { Workspace } from '../../types/workspace';

const useStyles = makeStyles((theme) => ({

}));

interface ExistingWorkspaceEditorProps {
    setWorkspace: (ws: Workspace) => void,
    loading: boolean,
}


export const ExistingWorkspaceEditor = (props: ExistingWorkspaceEditorProps) => {
    const [workspaces, setWorkspaces] = React.useState<Workspace[]>(null);

    React.useEffect(() => {
        workspaceService.fetchWorkspaces().then((retrievedWorkspaces) => {
            setWorkspaces(retrievedWorkspaces);
            console.log("Retrieved workspaces: ", retrievedWorkspaces);
        });
    }, []);

    return(
        <>
            <Box className="" p={3}>
                <Grid container={true} spacing={1}>
                    {
                        workspaces && workspaces.map((workspace, index) => {
                            if( index === 1){
                                props.setWorkspace(workspace);
                            }
                            return (
                                <Grid item={true} key={index} xs={6} sm={4} md={6} lg={4} xl={3}>
                                    <WorkspaceCard workspace={workspace} hideMenu={true}/>
                                </Grid>
                            );
                        })
                    }
                </Grid>
            </Box>
            {
                props.loading && 
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
        </>
    );
}

interface ExistingWorkspaceEditorActionsProps {
    disabled: boolean,
    closeAction: () => void,
    onAddClick: ()=> void,
}

export const ExistingWorkspaceEditorActions = (props: ExistingWorkspaceEditorActionsProps) => {
    return(
        <Box>
            <Grid container={true}>
                <Grid item={true}>
                    <Button color="primary" onClick={props.closeAction}>
                        Cancel
                    </Button>
                </Grid>
                <Grid item={true}>
                    <Button variant="contained" color="primary" disabled={props.disabled} onClick={props.onAddClick}>
                        Add to workspace
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}