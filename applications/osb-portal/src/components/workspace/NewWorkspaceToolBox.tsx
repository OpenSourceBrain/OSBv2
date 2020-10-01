import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, Paper } from "@material-ui/core";

import Box from "@material-ui/core/Box";


import "react-markdown-editor-lite/lib/index.css";

import { UserInfo } from "../../types/user";
import { ResourceType } from "../../types/global";

import WorkspaceItem, { WorkspaceTemplateType } from "./NewWorkspaceItem";

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
  cardHeading: {
    textAlign: "center",
    marginBottom: "20px",
    [theme.breakpoints.up("md")]: {
      paddingLeft: "20px",
      textAlign: "left",
    }
  },
}));



export const WorkspaceToolBox = (props: any) => {
  const classes = useStyles();

  const user: UserInfo = props.user;

  const type: string = props.type;

  return (
    <>

      <Box mt={3}>
        <Grid container={true} alignItems="center" justify="center" spacing={5}>
          <Grid sm={12} md={3}>
            <Typography component="h2" variant="h6" className={classes.cardHeading}>
              Create a new Workspace
            </Typography>
          </Grid>
          <Grid xs={12} sm={12} md={9}>
            <Grid xs={12} justify="center" item={true}>
              <WorkspaceItem
                icon={Icons.CircleIcon}
                title="Single Cell"
                template={WorkspaceTemplateType.singleCell}
                user={user}
              />
            </Grid>
            <Grid xs={12} justify="center" item={true}>
              <WorkspaceItem
                icon={Icons.SquareCirclesIcon}
                title="Network"
                template={WorkspaceTemplateType.network}
                user={user}
              />
            </Grid>
            <Grid xs={12} justify="center" item={true}>
              <WorkspaceItem
                icon={Icons.ChartIcon}
                title="Data Analysis"
                template={WorkspaceTemplateType.explorer}
                user={user}
              />
            </Grid>
            <Grid xs={12} justify="center" item={true}>
              <WorkspaceItem
                icon={Icons.CubeIcon}
                title="Playground"
                template={WorkspaceTemplateType.playground}
                user={user}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
