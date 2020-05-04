import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { MainMenuItem } from './MainMenuItem';

const useStyles = makeStyles((theme) => ({
  button: {
    textTransform: "inherit",
  },
}));

export const MainMenu = () => {
  const classes = useStyles();

  return (
    <Box display="flex" p={0} bgcolor="background.paper">
      <MainMenuItem title="OSB" className={classes.button} />
      <MainMenuItem title="Workspaces" className={classes.button} />
      <MainMenuItem title="Repositories" className={classes.button} />
      <MainMenuItem title="About" className={classes.button} />
      <MainMenuItem title="Help" className={classes.button} />
    </Box>
  )
}