import * as React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Paper } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import AppsOutlinedIcon from '@material-ui/icons/AppsOutlined';
import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined';
import CodeOutlinedIcon from '@material-ui/icons/CodeOutlined';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    margin: theme.spacing(1),
    textAlign: 'center',
  },
  h3: {
    marginBottom: theme.spacing(6),
  }
}));

export const WorkspaceToolBox = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <h3 className={classes.h3}>Create a new Workspace</h3>
      <Grid container={true}>
        <Grid item={true} xs={3}>
          <RadioButtonUncheckedIcon fontSize="large" />
          <Typography variant="subtitle1">Single Cell</Typography>
          <Typography variant="caption">NetPyNe</Typography>
        </Grid>
        <Grid item={true} xs={3}>
          <AppsOutlinedIcon fontSize="large" />
          <Typography variant="subtitle1">Network</Typography>
          <Typography variant="caption">NetPyNe</Typography>
        </Grid>
        <Grid item={true} xs={3}>
          <InsertChartOutlinedIcon fontSize="large" />
          <Typography variant="subtitle1">Data Analyses</Typography>
          <Typography variant="caption">NWB Explorer</Typography>
        </Grid>
        <Grid item={true} xs={3}>
          <CodeOutlinedIcon fontSize="large" />
          <Typography variant="subtitle1">Playground</Typography>
          <Typography variant="caption">Jupyter Lab</Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}