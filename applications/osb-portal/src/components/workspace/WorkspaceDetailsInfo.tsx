import * as React from 'react';

//theme
import { styled } from '@mui/styles';

import {
    paragraph,
} from "../../theme";

//components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

//icons
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';

const WorkspaceInfoSection = styled(Stack)(({ theme }) => ({

    '& .MuiTypography-subtitle1': {
        fontWeight: 600
    },
    '& .MuiTypography-body1': {
        fontSize: '0.857rem',
        color: paragraph
    },
    '& .MuiSvgIcon-root': {
        color: paragraph
    }

}))
const WorkspaceDetailsInfo = (props: any) => {

    const { user } = props.workspace;
    const { tags } = props.workspace;
    const { timestampUpdated } = props.workspace;

    return (

        <Box sx={{ height: '100%', overflow: 'hidden' }} pt={4} pl={2}>
            <WorkspaceInfoSection spacing={1}>
                <Typography variant='subtitle1'>Info</Typography>
                <Stack direction="row" spacing={1}>
                    <PersonIcon fontSize='small' />
                    <Typography>By {user.firstName} {user.lastName}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <CalendarTodayIcon fontSize='small' />
                    <Typography>Last Updated on {timestampUpdated.toLocaleDateString()}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <CollectionsBookmarkOutlinedIcon fontSize='small' />
                    <Typography>Experimental Data</Typography>
                </Stack>
            </WorkspaceInfoSection>
            <WorkspaceInfoSection spacing={1} mt={3}>
                <Typography variant='subtitle1'>Tags</Typography>
                <Box>
                    {
                        tags?.map((item,index)=>{
                            return (
                                <Chip key={index} label={item.tag} size='small' sx={{mt: 1}}/>
                            )
                        })
                    }
                </Box>
            </WorkspaceInfoSection>
        </Box>
    )
}
export default WorkspaceDetailsInfo;