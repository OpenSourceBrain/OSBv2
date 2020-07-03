import * as React from "react";

import { Typography, Grid, Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import DialogContentText from "@material-ui/core/DialogContentText";

import "react-markdown-editor-lite/lib/index.css";


export default (props: any) => {
  const keycloak = props.keycloak;
  const handleUserLogin = () => {
    keycloak.login();
  };
  const handleSignup = () => {
    keycloak.register();
  };

  return (
    <>
      <Grid container justify="space-between" alignItems="flex-end">
        <Grid item xs={12} sm={8} md={6}>
          <DialogContentText>
            To create a new workspace you need a Open Source Brain account. If
            you already have one please sign in, if not create one for free.
            Workspaces will let you save your own models and data, run
            simulations and analysis.
          </DialogContentText>
        </Grid>
        <Grid item>
          <div>
              <Button onClick={handleUserLogin} autoFocus={true}>
                Sign In
              </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSignup}
            >
              Sign Up
            </Button>
          </div>
        </Grid>
      </Grid>
    </>
  );
};
