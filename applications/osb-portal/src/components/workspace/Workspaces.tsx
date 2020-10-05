import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import WorkspaceCard from "./WorkspaceCard";
import { Workspace } from "../../types/workspace";


// TODO handle user's vs public workspaces
export const Workspaces = (props: any) => {
  const workspaces = props.workspaces;
  const workspaceList =
    workspaces
      ? workspaces.map((workspace: Workspace, index: number) => {
        return (
          <Grid item={true} key={index} xs={6} sm={4} md={6} lg={4} xl={3} >
            <WorkspaceCard workspace={workspace} />
          </Grid>
        );
      })
      : null;

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  if (!workspaces) {
    return null;
  }

  return (
    <React.Fragment>
      <Box mb={2}>
        <Tabs
          value={value}
          textColor="primary"
          indicatorColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="Your workspaces" />
          <Tab label="Featured workspaces" />
        </Tabs>
        <Typography variant="subtitle2" style={{ marginTop: "0.5em" }}>
          {workspaceList.length} Workspaces
        </Typography>
      </Box>
      <Box className="verticalFit card-container">
        <Box pt={1} pb={1} className="scrollbar">
          <Grid container={true} spacing={1}>
            {workspaceList}
          </Grid>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default Workspaces;
