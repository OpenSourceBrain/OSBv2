import * as React from 'react';
import { useHistory, useParams } from 'react-router';

//theme
import { styled } from '@mui/styles';
import { bgLightest as lineColor, paragraph, secondaryColor as white, chipBg, headerBg as hoverBg, bgDarkest, lightWhite } from '../theme';

//components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { HomePageSider } from '../components';
import { WorkspaceEditor, WorkspaceInteractions } from '../components';
import { OSBSplitButton } from '../components/common/OSBSplitButton';
import WorkspaceActionsMenu from '../components/workspace/WorkspaceActionsMenu';
import WorkspaceSidebar from '../components/workspace/WorkspaceSidebar';
import WorkspaceDetailsInfo from '../components/workspace/WorkspaceDetailsInfo';

//services
import { canEditWorkspace } from '../service/UserService';

//types
import {
    Workspace,
    WorkspaceResource,
    OSBApplication,
} from "../types/workspace";

//icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from "@mui/icons-material/Folder";

const NavbarButton = styled(Button)(({ theme }) => ({
    fontSize: '12px',
    textTransform: 'none',
    borderRadius: '6px',
    minHeight: '32px',
    fontWeight: 600,
    '&:hover': {
        backgroundColor: 'transparent'
    }
}));


export const WorkspacePage = (props: any) => {

    const history = useHistory();
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const workspace: Workspace = props.workspace;
    const user = props.user;
    const [editWorkspaceOpen, setEditWorkspaceOpen] = React.useState(false);
    const [refresh, setRefresh] = React.useState(true);
    const [error, setError] = React.useState<any>(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorElmoreVert, setAnchorElmoreVert] = React.useState(null);

    const isWorkspaceOpen = Boolean(anchorElmoreVert);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    if (!workspace) {
        props.selectWorkspace(workspaceId);
    }

    if (error) {
        throw error;
    }

    console.log('Props: ', props.workspace);
    console.log('IS Workspace open: ', isWorkspaceOpen);

    const handleCloseEditWorkspace = () => {
        props.refreshWorkspace(workspaceId);
        setEditWorkspaceOpen(false);
    };

    const handleResourceClick = (resource: WorkspaceResource) => {
        openWithApp(resource.type.application);
    };

    const openWithApp = (selectedOption: OSBApplication) => {
        history.push(`/workspace/open/${workspaceId}/${selectedOption.code}`);
    };

    const canEdit = canEditWorkspace(props.user, workspace);

    return workspace && (
        <>
            <Box className="verticalFit">
                <Grid container className="verticalFill">
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={3}
                        lg={2}
                        direction="column"
                        className="verticalFill"
                    >
                        <Box width={1} className="verticalFit">
                            <HomePageSider />
                        </Box>
                    </Grid>
                    <Grid
                        item={true}
                        xs={12}
                        sm={12}
                        md={9}
                        lg={10}
                        alignItems="stretch"
                        className="verticalFill"
                    >
                        <Box width={1} className="verticalFit">
                            <div id="workspace-details" className="verticalFit">
                                <Box>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Grid
                                            container={true}
                                            alignItems="center"
                                            className="verticalFill"
                                            spacing={1}
                                            sx={{ background: bgDarkest }}
                                        >
                                            <Grid
                                                item={true}
                                                xs={12}
                                                sm={12}
                                                md={7}
                                                lg={7}
                                                className="verticalFill"
                                            >
                                                <NavbarButton
                                                    variant="text"
                                                    startIcon={<ChevronLeftIcon />}
                                                    onClick={() => history.push('/')}
                                                    sx={{ color: paragraph, padding: '16px 24px' }}
                                                >
                                                    All workspaces
                                                </NavbarButton>
                                            </Grid>
                                            <Grid
                                                item={true}
                                                gap={1}
                                                xs={12}
                                                sm={8}
                                                md={5}
                                                lg={5}
                                                justifyContent='end'
                                                padding={'0 16px'}
                                            >
                                                {
                                                    canEdit && (
                                                        <NavbarButton
                                                            onClick={() => setEditWorkspaceOpen(true)}
                                                            sx={{
                                                                color: white,
                                                                border: `1px solid ${white}`,
                                                                '&:hover': {
                                                                    border: `1px solid ${white}`,
                                                                }
                                                            }}
                                                        >
                                                            Edit
                                                        </NavbarButton>
                                                    )
                                                }

                                                <OSBSplitButton
                                                    defaultSelected={workspace.defaultApplication}
                                                    handleClick={openWithApp}
                                                />

                                                <NavbarButton
                                                    size="small"
                                                    variant="contained"
                                                    aria-label="more"
                                                    id="threeDot-button"
                                                    onClick={(event) => setAnchorElmoreVert(event.currentTarget)}
                                                    sx={{
                                                        background: chipBg,
                                                        boxShadow: 'none',
                                                        minWidth: '32px'
                                                    }}
                                                >
                                                    <MoreVertIcon fontSize='small' />
                                                </NavbarButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                                <Box width={1} height={1} sx={{ overflowY: 'hidden' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4.5rem', gap: '1rem' }}>
                                        {!canEdit && (
                                            <Tooltip
                                                style={{ marginLeft: "0.3em" }}
                                                title="You do not have permissions to modify this workspace."
                                            >
                                                <LockOutlinedIcon sx={{ color: paragraph }} />
                                            </Tooltip>
                                        )}
                                        <Typography className='workspace-name-input' sx={{ fontSize: '24px' }}>{workspace.name}</Typography>
                                    </Box>
                                    <Box height={1} sx={{ background: 'rgba(0, 0, 0, 0.25)' }}>
                                        <Grid container height={1}>
                                            <Grid item xs>
                                                <WorkspaceSidebar />
                                            </Grid>
                                            <Grid item xs={7} justifyContent='center'>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '24px',
                                                    maxHeight: '560px',
                                                    overflowY: 'scroll',
                                                    padding: '24px 100px'
                                                }}
                                                >
                                                    <Box
                                                        className="imageContainer"
                                                        justifyContent="center"
                                                        alignItems="center"
                                                        display="flex"
                                                    >
                                                        {!workspace?.thumbnail ? (
                                                            <FolderIcon />
                                                        ) : (
                                                            <img
                                                                width={"100%"}
                                                                src={
                                                                    "/proxy/workspaces/" +
                                                                    workspace.thumbnail +
                                                                    "?v=" +
                                                                    workspace.timestampUpdated.getMilliseconds()
                                                                }
                                                                title={workspace.name}
                                                                alt={workspace.name}
                                                            />
                                                        )}
                                                    </Box>
                                                    <Divider />
                                                    <Typography variant="subtitle1" sx={{ color: lightWhite, letterSpacing: '0.01em', lineHeight: '24px' }}>
                                                        {workspace.description}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs>
                                                <WorkspaceDetailsInfo workspace={workspace} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </div>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {canEdit && editWorkspaceOpen && (
                <WorkspaceEditor
                    open={editWorkspaceOpen}
                    title={"Edit workspace: " + workspace.name}
                    closeHandler={handleCloseEditWorkspace}
                    workspace={workspace}
                    onLoadWorkspace={handleCloseEditWorkspace}
                    user={user}
                />
            )}
            {
                <WorkspaceActionsMenu
                    workspace={workspace}
                    user={user}
                    isWorkspaceOpen={isWorkspaceOpen}
                />
            }
        </>
    )
}
export default WorkspacePage;