import * as React from "react";
import { useHistory, useParams } from "react-router";

//theme
import { styled } from "@mui/styles";
import {
  paragraph,
  secondaryColor as white,
  chipBg,
  bgDarkest,
  lightWhite,
} from "../theme";

//components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { HomePageSider } from "../components";

export const SidebarPageLayout = (props: { children: any }) => (
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
          {props.children}
        </Box>
      </Grid>
    </Grid>
  </Box>
);
 

export default SidebarPageLayout;