import * as React from "react";

import Box from "@mui/material/Box";

import makeStyles from '@mui/styles/makeStyles';



const useStyles = makeStyles((theme) => ({
  paper: {
    overflow: "hidden",
  },

}));


export default (props: any) => {
  const classes = useStyles();

  return <>
    <Box p={1}>
     Home
    </Box>
  </>
};
