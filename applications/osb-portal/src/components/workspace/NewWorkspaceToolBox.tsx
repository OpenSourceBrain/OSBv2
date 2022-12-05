import * as React from "react";

import makeStyles from '@mui/styles/makeStyles';

import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { UserInfo } from "../../types/user";

import WorkspaceItem, { WorkspaceTemplateType } from "./NewWorkspaceItem";

import {SquareCirclesIcon, ChartIcon, CubeIcon} from "../icons";
import {secondaryColor, bgLightest} from '../../theme'

const useStyles = makeStyles((theme) => ({
    itemContainer: {
      border: '1px solid #4A4A4A',
      borderRadius: '4px',
      width:' 100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '26px',

      '&:hover': {
        backgroundColor: bgLightest
      },

      '& .MuiButtonBase-root':{
        color: secondaryColor,
        padding: 0
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
                icon={<SquareCirclesIcon />}
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
                icon={<ChartIcon />}
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
                icon={<CubeIcon />}
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
                icon={<FolderOpenIcon />}
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
