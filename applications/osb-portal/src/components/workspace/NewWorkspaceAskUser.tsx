import * as React from "react";

import { Typography, Grid, Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import DialogContentText from "@material-ui/core/DialogContentText";



export default (props: any) => {

  const handleUserLogin = () => {
    props.login();
  };
  const handleSignup = () => {
    props.register();
  };

  return (
    <Box p={4}>
      <Grid container={true} justify="space-between" alignItems="flex-end">
        <Grid item={true} xs={12} sm={8} md={8}>
          <DialogContentText>
          To use workspaces you need an Open Source Brain v2.0 account.
          If you already have one, please sign in, if not create one for free.
          Workspaces will let you save your own models and data, and run simulations and analyses.
          </DialogContentText>
        </Grid>
        <Grid item={true}>
          <Box mr={2}>
            <Button onClick={handleUserLogin} autoFocus={true}>
              Sign In
              </Button>
          </Box>
          <Button
            id='signup-workspace-dialog-button'
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
