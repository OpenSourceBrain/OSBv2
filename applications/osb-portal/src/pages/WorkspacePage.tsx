import * as React from "react";

//components
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from '@mui/material/Divider';
import { HomePageSider } from "../components";
import WorkspaceDetails from "../components/workspace/WorkspaceDetailsTabs";
import WorkspaceDetailsInfo from "../components/workspace/WorkspaceDetailsInfo";
import WorkspaceNavbar from "../components/workspace/WorkspaceNavbar";

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
                                    <WorkspaceNavbar/>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '11rem' }}>
                                    <LockOutlinedIcon />
                                    <Typography sx={{ fontSize: '1.714rem', ml: '1.143rem' }} >My Workspace</Typography>
                                </Box>
                                <Box className="verticalFit">
                                    <Grid container sx={{ height: 'calc(100%)', overflow: 'hidden', background: 'rgba(0, 0, 0, 0.25)'}}>
                                        <Grid item xs>
                                            <WorkspaceDetails />
                                        </Grid>
                                        <Grid item xs={7} alignItems="center" sx={{ padding: '1.714rem 7.143rem' }}>
                                            <Stack spacing={4}>
                                                <img src="/images/workspace-banner.png" alt="workspace img" />
                                                <Divider />
                                                <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
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
                                            </Stack>
                                        </Grid>
                                        <Grid item xs>
                                            <WorkspaceDetailsInfo/>
                                        </Grid>
                                    </Grid>
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