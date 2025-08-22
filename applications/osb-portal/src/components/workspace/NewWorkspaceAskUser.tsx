import * as React from "react";
import { useDispatch } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import { userLogin } from "../../store/actions/user";

export const NewWorkspaceAskUser = (props: { type: string }) => {
  const dispatch = useDispatch();
  
  const handleUserLogin = () => {
    dispatch(userLogin());
  };
  
  const handleSignup = () => {
    // For now, using userLogin since register action doesn't exist yet
    // This should be replaced with proper registration action when implemented
    dispatch(userLogin());
  };

  return (
    <Box>
      <Grid container={true} justifyContent="center">
        <Grid item={true} xs={12} mb={3}>
          <DialogContentText>
            To use {props.type} you need an Open Source Brain v2.0 account. If
            you already have one, please sign in, if not create one for free.
            Workspaces will let you save your own models and data, and run
            simulations and analyses.
          </DialogContentText>
        </Grid>
        <Grid item={true} xs={12}>
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
