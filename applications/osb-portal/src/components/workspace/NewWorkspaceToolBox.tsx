import * as React from "react";

//components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import WorkspaceItem, { WorkspaceTemplateType } from "./NewWorkspaceItem";

//types
import { UserInfo } from "../../types/user";

//icons
import {
  ComputationalModeling,
  DataAnalystIcon,
  WorkspaceFromRepository,
  WorkspaceIcon,
} from "../icons";

//style
import {
  secondaryColor,
  bgLightest,
  bgLight,
  badgeBgLight,
  lightWhite,
} from "../../theme";
import styled from "@mui/system/styled";

const StyledContainerBox = styled(Box)(({ theme }) => ({
  borderRadius: "4px",
  width: " 100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "1rem 0",

  "&:hover": {
    backgroundColor: bgLightest,
    borderRadius: 6,
    "& .MuiButtonBase-root": {
      "& .MuiSvgIcon-root": {
        fill: badgeBgLight,
      },
    },
  },

  "& .MuiButtonBase-root": {
    color: secondaryColor,
    padding: 0,

    "& .MuiSvgIcon-root": {
      fontSize: "2rem",
      fill: bgLight,
    },

    "& .MuiTypography-caption": {
      textTransform: "uppercase",
    },
  },
}));

export const WorkspaceToolBox = (props: any) => {
  const user: UserInfo = props.user;
  return (
    <>
      <Box>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} lg={6}>
            <StyledContainerBox component="span" id="computational-modeling">
              <WorkspaceItem
                icon={<WorkspaceIcon />}
                title="Computational modeling"
                template={WorkspaceTemplateType.network}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
                closeMainDialog={(isClosed) => props.closeMainDialog(isClosed)}
              />
            </StyledContainerBox>
          </Grid>
          <Grid item xs={12} lg={6}>
            <StyledContainerBox component="span" id="data-analysis">
              <WorkspaceItem
                icon={<DataAnalystIcon />}
                title="Data analysis"
                template={WorkspaceTemplateType.explorer}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
                closeMainDialog={(isClosed) => props.closeMainDialog(isClosed)}
              />
            </StyledContainerBox>
          </Grid>
          <Grid item xs={12} lg={6}>
            <StyledContainerBox component="span" id="interactive-development">
              <WorkspaceItem
                icon={<ComputationalModeling />}
                title="Interactive development"
                template={WorkspaceTemplateType.playground}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
                closeMainDialog={(isClosed) => props.closeMainDialog(isClosed)}
              />
            </StyledContainerBox>
          </Grid>
          <Grid item xs={12} lg={6}>
            <StyledContainerBox component="span" id="workspace-from-repository">
              <WorkspaceItem
                className="from-repository-create-workspace-item"
                icon={<WorkspaceFromRepository />}
                title="Workspace from repository"
                template={null}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
                closeMainDialog={(isClosed) => props.closeMainDialog(isClosed)}
              />
            </StyledContainerBox>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
