import React from "react";
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as Sentry from '@sentry/react';

export const ErrorDialog = (props: any) => {
  const handleClose = () => {
    props.setError(null);
    window.open("/", "_self");
  };

  const handleReport = () => {
    Sentry.captureException(new Error(props.error));
    window.open("https://github.com/OpenSourceBrain/OSBv2/issues/new");
  };

  return (<Dialog
    open={props.error !== null}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
    <DialogContent>
      <Alert severity="error" key={1}><div className="errorAlertDiv" key={"div-1"} dangerouslySetInnerHTML={{ __html: props.error }} /></Alert>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleReport} color="primary" autoFocus={true}>
        Report
      </Button>
      <Button onClick={handleClose} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>);

};
