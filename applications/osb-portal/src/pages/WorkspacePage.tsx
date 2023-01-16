import * as React from 'react';

//components
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { HomePageSider } from '../components';
import WorkspacePageNavbar from '../components/workspace/WorkspacePageNavbar';
import WorkspacePageDetails from '../components/workspace/WorkspacePageDetails';

//icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const WorkspacePage = () => {

    return (
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
                                    <WorkspacePageNavbar/>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '11rem' }}>
                                    <LockOutlinedIcon />
                                    <Typography sx={{ fontSize: '1.714rem', ml: '1.143rem' }} >My Workspace</Typography>
                                </Box>
                                <Box className="verticalFit">
                                    <WorkspacePageDetails/>
                                </Box>
                            </div>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default WorkspacePage;