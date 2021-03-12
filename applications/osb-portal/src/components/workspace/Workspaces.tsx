import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';

import WorkspaceCard from "./WorkspaceCard";
import { Workspace } from "../../types/workspace";



// TODO handle user's vs public workspaces
export const Workspaces = ({ publicWorkspaces, userWorkspaces, showPublicWorkspaces, showUserWorkspaces, showPublic, user, deleteWorkspace, updateWorkspace, refreshWorkspaces }: any) => {


  React.useEffect(() => {
    refreshWorkspaces();
  }, [])

  const workspaces = showPublic || !user ? publicWorkspaces : userWorkspaces;
  const workspaceList =
    workspaces
      ? workspaces.map((workspace: Workspace, index: number) => {
        return (
          <Grid item={true} key={index} xs={6} sm={4} md={6} lg={4} xl={3} >
            <WorkspaceCard workspace={workspace} deleteWorkspace={deleteWorkspace} updateWorkspace={updateWorkspace} user={user} />
          </Grid>
        );
      })
      : null;



  const handleChange = (event: React.ChangeEvent<{}>, isPublicSelected: boolean) => {
    if (isPublicSelected) {
      showPublicWorkspaces()
    } else {
      showUserWorkspaces()
    }
  };
  if (!workspaces) {
    return null;
  }

  return (
    <React.Fragment>
      {
        Boolean(user) && <Tabs
          value={showPublic}
          textColor="primary"
          indicatorColor="primary"
          onChange={handleChange}
        >
          <Tab value={false} label={user.isAdmin ? "All workspaces" : "Your workspaces"} />
          <Tab value={true} label="Featured workspaces" />
        </Tabs>
      }
      {
        workspaceList && <Box mb={2}>

          <Typography variant="subtitle2" style={{ marginTop: "0.5em" }}>
            {workspaceList.length} Workspace{workspaceList.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      }

      <Box className="verticalFit card-container">
        <Box pt={1} pb={1} className="scrollbar">
          <Grid container={true} spacing={1}>
            {workspaceList ? workspaceList : <CircularProgress />}
          </Grid>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default Workspaces;
