import * as React from "react";

//components
import {Box, Grid, Paper} from "@mui/material";

import {
  HomePageSider,
  Workspaces,
} from "../components";


//style
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  paper: {
    overflow: "hidden",
    borderRadius: 0
  },
  toolbar: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  }
}));

export const HomePage = (props: any) => {

  const classes = useStyles();

  return (
      <>
        <Box className="verticalFit">
          <Grid container={true} className="verticalFill">
            <Grid
                item={true}
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
                <div id="workspaces-list" className="verticalFit">
                  <Workspaces />
                </div>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </>
  );
};

export default HomePage
