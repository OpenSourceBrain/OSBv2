import * as React from "react";

import makeStyles from '@mui/styles/makeStyles';

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { UserInfo } from "../../types/user";

import WorkspaceItem, { WorkspaceTemplateType } from "./NewWorkspaceItem";

import {
  ComputationalModeling,
  DataAnalystIcon,
  WorkspaceFromRepository,
  WorkspaceIcon
} from "../icons";
import {secondaryColor, bgLightest, bgLight, badgeBgLight} from '../../theme'

const useStyles = makeStyles((theme) => ({
    itemContainer: {
      borderRadius: '4px',
      width:' 100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '1rem 0',

      '&:hover': {
        backgroundColor: bgLightest,
        borderRadius:  6,

        '& .MuiSvgIcon-root': {
            fill: badgeBgLight
        }
      },

      '& .MuiButtonBase-root':{
        color: secondaryColor,
        padding: 0,

        '& .MuiSvgIcon-root': {
          fontSize: '2rem',
          fill: bgLight
        },

        '& .MuiTypography-caption': {
          textTransform: 'uppercase'
        }
      }
    }
}));

export const WorkspaceToolBox = (props: any) => {
  const classes = useStyles();

  const user: UserInfo = props.user;

  return<>
    <Box>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} lg={6}>
          <Box component="span" className={classes.itemContainer}>
            <WorkspaceItem
                icon={<WorkspaceIcon />}
                title="Computational modeling"
                template={WorkspaceTemplateType.network}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
            />
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box component="span" className={classes.itemContainer}>
            <WorkspaceItem
                icon={<DataAnalystIcon />}
                title="Data analysis"
                template={WorkspaceTemplateType.explorer}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
            />
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box component="span" className={classes.itemContainer}>
            <WorkspaceItem
                icon={<ComputationalModeling />}
                title="Interactive development"
                template={WorkspaceTemplateType.playground}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
            />
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box component="span" className={classes.itemContainer}>
            <WorkspaceItem
                className="from-repository-create-workspace-item"
                icon={<WorkspaceFromRepository />}
                title="Workspace from repository"
                template={null}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  </>;
};
