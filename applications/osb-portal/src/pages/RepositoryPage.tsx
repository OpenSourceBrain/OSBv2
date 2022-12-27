import * as React from 'react';
import { useHistory } from "react-router-dom";

//theme 
import { styled } from "@mui/styles";
import {
  linkColor,
  bgLightest as lineColor,
  paragraph,
  secondaryColor as white,
  chipBg,
} from "../theme";

//components
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { HomePageSider } from '../components';
import RepositoryPageBanner from '../components/repository/RepositoryPageBanner';

//icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const GoBackButton = styled(Button)(({ theme }) => ({
  color: paragraph,
  fontSize: '0.857rem',
  textTransform: 'none',
  "&:hover": {
    backgroundColor: 'transparent'
  }
}));

const AddSelectionButton = styled(Button)(({ theme }) => ({
  color: white,
  fontSize: '0.875rem',
  textTransform: 'none',
  borderRadius: '6px',
  border: `1px solid ${white}`,
  "&:hover": {
    border: `1px solid ${white}`,
    backgroundColor: 'transparent'
  }
}));

const NewWorkspaceButton = styled(Button)(({ theme }) => ({
  background: linkColor,
  border: `1px solid #000`,
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  borderRadius: '6px',
  "& .MuiButton-root": {
    textTransform: 'none'
  }
}));

const ThreeDotButton = styled(Button)(({ theme }) => ({
  background: chipBg,
  minWidth: '32px',
  borderRadius: '6px',
  boxShadow: 'none',
  "&:hover": {
    background: 'transparent'
  }
}));


export const RepositoryPage = (props: any) => {

  const history = useHistory();

  return <>
    <Box className='verticalFit'>
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
          <Box width={1} className='verticalFit'>
            <Box borderBottom={`2px solid ${lineColor}`}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ padding: '0.571rem 1.143rem' }}
              >
                <GoBackButton variant="text" startIcon={<ChevronLeftIcon />} onClick={() => history.push("/repositories")}>All repositories</GoBackButton>
                <Stack display="flex" direction="row" spacing={2}>
                  <AddSelectionButton
                    variant="outlined"
                    disableElevation={true}
                  >
                    Add selection to existing workspace
                  </AddSelectionButton>
                  <NewWorkspaceButton
                    variant="contained"
                    disableElevation={true}
                    color="primary"
                  >
                    New workspace from selection
                  </NewWorkspaceButton>
                  <ThreeDotButton
                    size="small"
                    variant="contained"
                    aria-label="more"
                    id="threeDot-button"
                  >
                    <MoreVertIcon />
                  </ThreeDotButton>

                </Stack>
              </Box>
            </Box>
            <RepositoryPageBanner />
            <Box className='verticalFit'>
              
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  </>
}
export default RepositoryPage;

