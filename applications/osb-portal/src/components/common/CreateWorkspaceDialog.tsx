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
        backgroundColor: bgDarker,
        backgroundImage: 'unset',
    }
}));

export default ({ dialogOpen, handleClose }: { dialogOpen: boolean, handleClose: (open: boolean) => any}) => {
  const classes = useStyles();

  return (
      <OSBDialog
          closeAction={() => handleClose(false)}
          title='Create a new workspace'
          subTitle={<>Quickly create a workspace by choosing <br/> one of the predefined templates</>}
          open={dialogOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className='createWorkspaceRepo'
      >
          <Paper className={classes.paper}>
              <WorkspaceToolBox />
          </Paper>
      </OSBDialog>
  );
};
