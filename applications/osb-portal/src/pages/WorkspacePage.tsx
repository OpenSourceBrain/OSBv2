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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { HomePageSider } from '../components';
import { WorkspaceEditor, WorkspaceInteractions } from '../components';
import { OSBSplitButton } from '../components/common/OSBSplitButton';
import WorkspaceActionsMenu from '../components/workspace/WorkspaceActionsMenu';
import WorkspaceDetailsTabs from '../components/workspace/WorkspaceDetailsTabs';
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

    if (!workspace) {
        props.selectWorkspace(workspaceId);
    }

    if (error) {
        throw error;
    }

    console.log('Props: ', props.workspace);

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
                                        {!canEdit && <LockOutlinedIcon sx={{ color: paragraph }} />}
                                        <TextField
                                            className='workspace-name-input'
                                            defaultValue={workspace.name}
                                            sx={{
                                                maxWidth: '160px',
                                                '& .MuiInputBase-root': {
                                                    fontSize: '1.714rem',
                                                    'fieldset': {
                                                        border: 'none',
                                                        display: 'inline',
                                                        fontFamily: 'inherit',
                                                        padding: 'none',
                                                        width: 'auto'
                                                    },
                                                    'input': {
                                                        padding: 0
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Box height={1} sx={{ background: 'rgba(0, 0, 0, 0.25)' }}>
                                        <Grid container>
                                            <Grid item xs>
                                                <WorkspaceDetailsTabs />
                                            </Grid>
                                            <Grid item xs={7} alignItems="center" padding={'24px 100px'} sx={{ overflowY: 'scroll' }}>
                                                <Box sx={{
                                                    display:'flex',
                                                    flexDirection: 'column',
                                                    gap: '24px'
                                                }}
                                                >
                                                    <Box
                                                        component='img'
                                                        src="/images/workspace-banner.png"
                                                        alt="workspace img"
                                                    />
                                                    <Divider/>
                                                    <Typography variant="subtitle1" sx={{ color: lightWhite, letterSpacing: '0.01em', lineHeight: '24px' }}>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                        Maecenas vestibulum id tellus nec facilisis.
                                                        Nullam at feugiat diam. Vestibulum molestie lacinia dignissim.
                                                        Sed euismod augue magna. Morbi posuere vulputate viverra.
                                                        Proin nec risus quis nunc mollis fringilla quis sit amet ante.
                                                        Aliquam ut nibh consectetur, imperdiet mi et, euismod mi.
                                                        Vestibulum tristique vel arcu a facilisis.
                                                        Maecenas tristique felis et nunc elementum aliquam.
                                                        Etiam dictum nunc vel eros consectetur tincidunt.
                                                        Maecenas sed consequat metus.
                                                        Sed euismod augue magna.
                                                        Morbi posuere vulputate viverra.
                                                        Proin nec risus quis nunc mollis fringilla quis sit amet ante.
                                                        Aliquam ut nibh consectetur, imperdiet mi et, euismod mi.
                                                        Vestibulum tristique vel arcu a facilisis.
                                                        Maecenas tristique felis et nunc elementum aliquam.
                                                        Etiam dictum nunc vel eros consectetur tincidunt.
                                                        Maecenas sed consequat metus.
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

        </>
    )
}
export default WorkspacePage;