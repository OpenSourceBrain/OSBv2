import React from "react";
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as Sentry from '@sentry/browser';

export const ErrorDialog = (props: any) => {
  const handleClose = () => {
    props.setError(null);
  };

  const handleReport = () => {
    Sentry.captureException(new Error(props.error));
    handleClose();
  };

  if (props.error !== null){
    const alerts = <Alert severity="error" key={1}><div className="errorAlertDiv" key={"div-1"} dangerouslySetInnerHTML={{ __html: props.error }} /></Alert>;

    return (<Dialog
      open={props.error !== null}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
      <DialogContent>
        {alerts}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReport} color="primary">
          Report
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>);
  }

  return <div />;
};
