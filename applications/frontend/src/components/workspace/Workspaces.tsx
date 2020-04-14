import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';

import { RootState } from '../../store/rootReducer';
import { Workspace } from '../../types/workspace';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    textAlign: 'left'  },
  h3: {
    marginBottom: theme.spacing(2),
    color: "#00bcd4",
  },
  folder: {
    width: "100%",
    height: "10rem",
    margin: "auto",
  }
}));

export const Workspaces = (props: any) => {
  const classes = useStyles();

  const workspaces = props.workspaces;
  const workspaceList = workspaces !== null ? workspaces.map((workspace: Workspace, index: number) => {
    return (
      <Grid item={true} xs={6} sm={4} md={3} lg={2} key={index}>
        <Paper className={classes.paper}>
          <FolderIcon fontSize="large" className={classes.folder} />
          <div><Typography variant="subtitle1">{workspace.name} - {workspace.id}</Typography></div>
          <div><Typography variant="caption">{workspace.description}</Typography></div>
          <div><Typography variant="caption">Last edited: {workspace.lastEditedUserId}, {workspace.lastEdited}</Typography></div>
        </Paper>
      </Grid>
    )
  }) : null;

  return (
    <React.Fragment>
      <h3 className={classes.h3}>Your Workspaces</h3>
      <Grid container={true}>
        {workspaceList}
      </Grid>
    </React.Fragment>
  );
}
