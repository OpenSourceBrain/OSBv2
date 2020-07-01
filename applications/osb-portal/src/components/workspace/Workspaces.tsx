import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

import WorkspaceCard from "./WorkspaceCard";
import { Workspace } from "../../types/workspace";

export const Workspaces = (props: any) => {
  const workspaces = props.workspaces;
  const workspaceList =
    workspaces !== null
      ? workspaces.map((workspace: Workspace, index: number) => {
          return (
            <Grid item={true} key={index}>
              <WorkspaceCard workspace={workspace} />
            </Grid>
          );
        })
      : null;

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <Box mt={3} mb={2}>
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
      </Box>
      <div className="verticalFit">
        <div className="scrollbar">
          <Grid container={true} spacing={1}>{workspaceList}</Grid>
        </div>
      </div>
    </React.Fragment>
  );
};
