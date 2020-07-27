import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, Paper } from "@material-ui/core";

import Box from "@material-ui/core/Box";


import "react-markdown-editor-lite/lib/index.css";

import { UserInfo } from "../../types/user";
import { ResourceType } from "../../types/global";

import WorkspaceItem from "./NewWorkspaceItem";

import * as Icons from '../icons';

const useStyles = makeStyles((theme) => ({
  iconButton: {
    width: "2em",
    height: "2em",
    padding: 0,
  },
  svgIcon: {},

  dialogButtons: {
    paddingRight: 0,
  },
}));



export const WorkspaceToolBox = (props: any) => {
  const classes = useStyles();

  const user: UserInfo = props.user;

  const type: string = props.type;

  return (
    <>

      <Typography component="h2" variant="h6" align="center" gutterBottom={true}>
        Create a new Workspace
      </Typography>
      <Box mt={3}>
        <Grid container={true} alignItems="center" justify="center" spacing={5}>
          <Grid item={true}>
            <WorkspaceItem
              icon={Icons.CircleIcon}
              title="Single Cell"
              application={ResourceType.M}
              user={user}
            />
          </Grid>
          <Grid item={true}>
            <WorkspaceItem
              icon={Icons.SquareCirclesIcon}
              title="Network"
              application={ResourceType.M}
              user={user}
            />
          </Grid>
          <Grid item={true}>
            <WorkspaceItem
              icon={Icons.ChartIcon}
              title="Data Analysis"
              application={ResourceType.E}
              user={user}
            />
          </Grid>
          <Grid item={true}>
            <WorkspaceItem
              icon={Icons.CubeIcon}
              title="Playground"
              application={ResourceType.G}
              user={user}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
