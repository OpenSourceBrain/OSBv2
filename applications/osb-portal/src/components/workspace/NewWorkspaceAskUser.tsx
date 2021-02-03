import * as React from "react";

import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import { useUserService } from "../../service/UserService";


const NewWorkspaceAskUser = () => {
  const userService = useUserService();
  const handleUserLogin = () => {
    userService.login();
  };
  const handleSignup = () => {
    userService.register();
  };

  return (
    <>
      <Grid container={true} justify="space-between" alignItems="flex-end">
        <Grid item={true} xs={12} sm={8} md={6}>
          <DialogContentText>
            To create a new workspace you need a Open Source Brain account. If
            you already have one please sign in, if not create one for free.
            Workspaces will let you save your own models and data, run
            simulations and analysis.
          </DialogContentText>
        </Grid>
        <Grid item={true}>
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

export default NewWorkspaceAskUser;
