import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    textAlign: "left",
  },
}));

export const Latest = () => {
  const classes = useStyles();

  return (
    <>
      <Typography component="h2" variant="h6" gutterBottom>
        Latest
      </Typography>
      <Box mt={3}>
        <Typography>
          20/03/2021 - OSB Meeting announced, yes still Hotel Calabona
        </Typography>
        <Typography>20/03/2023 - NeuroML 6 released</Typography>
        <Typography>20/03/2041 - C. elegans fully simulated!</Typography>
      </Box>
    </>
  );
};
