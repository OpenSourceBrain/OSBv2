import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import workspaceService from '../../service/WorkspaceService';
import WorkspaceCard from "../workspace/WorkspaceCard";
import { Workspace } from '../../types/workspace';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Radio from "@material-ui/core/Radio";
import { RadioGroup } from "@material-ui/core";
import { linkColor } from "../../theme";

const useStyles = makeStyles((theme) => ({
    workspacesBox: {
        height: '400px',
        overflow: 'auto',
        "& .MuiGrid-container": {
            "& .MuiGrid-item": {
                "& .active-button": {
                    border: `3px solid ${linkColor}`,
                },

            },
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: 'transparent',
        },
    },
    workspaceButton: {
        padding: 0,
        width: '100%',
        "& .MuiButton-label": {
            "& .not-active": {
                display: 'none',
            },
            "& .MuiCard-root": {
                minHeight: 'fit-content',
                "& .MuiBox-root": {
                    "& .MuiLink-root": {
                        "& .MuiSvgIcon-root": {
                            padding: '0.5rem',
                        },
                    }, 
                },
                "& .MuiCardContent-root": {
                    "& .MuiLink-root": {
                        "& .MuiTypography-h5": {
                            fontSize: '1rem',
                        },  
                    },
                    "& .MuiTypography-caption": {
                        fontSize: '0.6rem',
                    },
                },
            }
        },
        "& a": {
            pointerEvents: 'none',
        }
    },
    checkMarkIcon: {
        position: 'absolute',
        top: 0,
        left: 0,
        marginLeft: '0.5rem',
        marginTop: '0.5rem',
    },
}));

interface ExistingWorkspaceEditorProps {
    setWorkspace: (ws: Workspace) => void,
    loading: boolean,
}


export const ExistingWorkspaceEditor = (props: ExistingWorkspaceEditorProps) => {
    const classes = useStyles();

    let classNames: string[] = [];
    const [activeCardClassNames, setActiveCardClassNames] = React.useState<string[]>([]);
    const [workspaces, setWorkspaces] = React.useState<Workspace[]>(null);

    React.useEffect(() => {
        workspaceService.fetchWorkspaces().then((retrievedWorkspaces) => {
            setWorkspaces(retrievedWorkspaces);
            setActiveCardClassNames(Array(retrievedWorkspaces.length).fill('not-active'));
            console.log("Retrieved workspaces: ", retrievedWorkspaces);
        });
    }, []);

    const handleWorkspaceSelection = (index: number) => {
        console.log('Inside click event', index);
        let placeHolderArray = Array(workspaces.length).fill('not-active');
        placeHolderArray[index] = 'active';
        setActiveCardClassNames(placeHolderArray);
    }

    return(
        <>
            <Box p={3} className={`${classes.workspacesBox} scrollbar`} >
                <Grid container={true} spacing={1}>
                    {
                        workspaces && workspaces.map((workspace, index) => {
                            return (
                                <Grid item={true} key={index} xs={6} sm={4} md={4} lg={4} xl={3}>
                                    <Button className={`${activeCardClassNames[index]}-button ${classes.workspaceButton}`} onClick={() => handleWorkspaceSelection(index)}
                                        disableRipple={true}>
                                        <CheckCircleIcon className={`${activeCardClassNames[index]} ${classes.checkMarkIcon}`} color="primary"/>
                                        <WorkspaceCard workspace={workspace} hideMenu={true} />
                                    </Button>
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
    onAddClick: () => void,
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