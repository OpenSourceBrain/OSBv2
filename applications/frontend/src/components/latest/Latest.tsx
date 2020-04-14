import * as React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    textAlign: 'left',
  },
}));

export const Latest = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <h3>Latest</h3>
      <br />
      <p>20/03/2021 - OSB Meeting announced, yes still Hotel Calabona</p>
      <p>20/03/2023 - NeuroML 6 released</p>
      <p>20/03/2041 - C. elegans fully simulated!</p>
    </Paper>
  )
}