import * as React from "react";

import makeStyles from '@mui/styles/makeStyles';

import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { UserInfo } from "../../types/user";

import WorkspaceItem, { WorkspaceTemplateType } from "./NewWorkspaceItem";

import {SquareCirclesIcon, ChartIcon, CubeIcon} from "../icons";

const useStyles = makeStyles((theme) => ({

}));

export const WorkspaceToolBox = (props: any) => {
  const classes = useStyles();

  const user: UserInfo = props.user;

  return<>
    <Box>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} lg={6}>
          <Box component="span" sx={{ p: 2, border: '1px solid grey', width: '100%' }}>
            <WorkspaceItem
                className="computational-modelling-create-workspace-item"
                icon={<SquareCirclesIcon />}
                title="Computational modeling"
                template={WorkspaceTemplateType.network}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
            />
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box component="span" sx={{ p: 2, border: '1px solid grey', width: '100%' }}>
            <WorkspaceItem
                className="data-analysis-create-workspace-item"
                icon={<ChartIcon />}
                title="Data analysis"
                template={WorkspaceTemplateType.explorer}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
            />
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box component="span" sx={{ p: 2, border: '1px solid grey', width: '100%' }}>
            <WorkspaceItem
                className="interactive-development-create-workspace-item"
                icon={<CubeIcon />}
                title="Interactive development"
                template={WorkspaceTemplateType.playground}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
            />
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box component="span" sx={{ p: 2, border: '1px solid grey', width: '100%' }}>
            <WorkspaceItem
                className="from-repository-create-workspace-item"
                Icon={<FolderOpenIcon />}
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
