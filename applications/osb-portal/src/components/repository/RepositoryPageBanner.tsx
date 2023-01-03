import * as React from 'react';

//theme
import { styled } from "@mui/styles";
import { chipBg } from "../../theme";

//components
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

//icons
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

const RepoPageBannerBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    '& .MuiTypography-h1': {
        fontWeight: 400
    },
    '& .MuiChip-root': {
        background: chipBg,
        margin: '0.25rem'
    }
}));

const RepositoryPageBanner = () => {
    return <RepoPageBannerBox mt={5} mb={5}>
        <Typography variant='h1'>
            NWB Showcase
        </Typography>
        <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((item, index) => {
                return <Chip label={'testTag'} key={index} />
            })}
        </Box>
        <Stack direction='row' spacing={2}>
            <Stack direction='row' alignItems='center'>
                <IconButton>
                    <PersonOutlineIcon fontSize='small' />
                </IconButton>
                <Typography variant='body2' sx={{ display: 'inline-flex', alignItems: 'baseline'}}>By
                    <Typography variant='body2' color='primary' sx={{ml: '3px'}}>Padraig Gleeson</Typography>
                </Typography>
            </Stack>
            <Stack direction='row' alignItems='center'>
                <IconButton>
                    <CalendarTodayOutlinedIcon fontSize='small' />
                </IconButton>
                <Typography variant='body2'>Last Updated on September 1, 2021</Typography>
            </Stack>
            <Stack direction='row' alignItems='center'>
                <IconButton>
                    <LinkOutlinedIcon fontSize='small' />
                </IconButton>
                <Typography variant='body2'>GitHub</Typography>
            </Stack>

        </Stack>
    </RepoPageBannerBox>
};

export default RepositoryPageBanner;
