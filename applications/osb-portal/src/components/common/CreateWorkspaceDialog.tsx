import * as React from "react";

//components
import OSBDialog from "./OSBDialog";
import Paper from '@mui/material/Paper'
import {WorkspaceToolBox} from "../workspace/NewWorkspaceToolBox";

//style
import { makeStyles } from "@mui/styles";
import { bgDarker } from '../../theme'


const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '1.143rem 1.714rem',
        backgroundColor: bgDarker
    }
}));

export default ({ dialogOpen, handleCloseDialog }: { dialogOpen: boolean, handleCloseDialog: (open: boolean) => any}) => {
  const classes = useStyles();

  return (
      <OSBDialog
          closeAction={() => handleCloseDialog(false)}
          title=' Create a new workspace'
          open={dialogOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
          <Paper className={classes.paper}>
              <WorkspaceToolBox />
          </Paper>
      </OSBDialog>
  );
};
