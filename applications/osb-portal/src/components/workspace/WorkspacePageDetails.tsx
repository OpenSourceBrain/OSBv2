import * as React from 'react';

//components
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import WorkspaceDetailsInfo from './WorkspaceDetailsInfo';
import WorkspaceDetailsTabs from './WorkspaceDetailsTabs';

const WorkspacePageDetails = () => {
    return (
        <Grid container sx={{ height: 'calc(100%)', overflow: 'hidden', background: 'rgba(0, 0, 0, 0.25)' }}>
            <Grid item xs>
                <WorkspaceDetailsTabs />
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
                <WorkspaceDetailsInfo />
            </Grid>
        </Grid>
    )
};

export default WorkspacePageDetails;