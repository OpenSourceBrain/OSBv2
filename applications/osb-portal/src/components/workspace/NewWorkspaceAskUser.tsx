import * as React from "react";

import { Typography, Grid, Box } from "@mui/material";
import Button from "@mui/material/Button";
import { Theme } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import DialogContentText from "@mui/material/DialogContentText";

export default (props: any) => {
  const handleUserLogin = () => {
    props.login();
  };
  const handleSignup = () => {
    props.register();
  };

  return (
    <Box p={4}>
      <Grid container={true} justifyContent="space-between" alignItems="flex-end">
        <Grid item={true} xs={12} sm={8} md={8}>
          <DialogContentText>
            To use workspaces you need an Open Source Brain v2.0 account. If you
            already have one, please sign in, if not create one for free.
            Workspaces will let you save your own models and data, and run
            simulations and analyses.
          </DialogContentText>
        </Grid>
        <Grid item={true}>
          <Box mr={2}>
            <Button onClick={handleUserLogin} autoFocus={true}>
              Sign In
            </Button>
          </Box>
          <Button
            id="signup-workspace-dialog-button"
            variant="contained"
            color="secondary"
            onClick={handleSignup}
          >
            Sign Up
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
