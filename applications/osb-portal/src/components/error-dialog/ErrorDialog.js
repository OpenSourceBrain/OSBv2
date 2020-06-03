import React from "react";
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as Sentry from '@sentry/browser';

const ErrorDialog = ({ errors, onClearErrors }) => {
  const handleClose = () => {
    onClearErrors();
  };

  const handleReport = () => {
    errors.map((value, index) => Sentry.captureException(new Error(value)));
    onClearErrors();
  };

  if (errors.length > 0){
    const alerts = errors.map((value, index) => <Alert severity="error" key={index}><div className="errorAlertDiv" key={"div-" + index} dangerouslySetInnerHTML={{ __html: value }} /></Alert>);

    return (<Dialog
      open={errors.length > 0}
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

  return "";
};

export default ErrorDialog;
