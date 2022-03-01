import React from 'react';
import * as Sentry from '@sentry/react';
import Alert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

interface OwnState {
  eventId: string;
  hasError: string;
  message: string;
}

const ERROR_MESSAGES: any = {
  UNAUTHORIZED: "You are not autorized to view this content."
}

class OSBErrorBoundary extends React.Component<{}, OwnState> {
  public state: OwnState = {
    eventId: null,
    hasError: null,
    message: null
  };

  constructor(props: any) {
    super(props);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    Sentry.withScope((scope: any) => {
      scope.setExtras(errorInfo);
      const eventId: string = Sentry.captureException(error);
      let message = "Oops. Something went wrong.";
      if (error.status) {
        message = ERROR_MESSAGES[error.statusText] || error.statusText;
      }
      this.setState({ ...this.state, eventId, message });
    });
  }



  render() {
    if (this.state.hasError) {
      // render fallback UI
      return (
        <>
          <Dialog open={true}>
            <DialogTitle  id="alert-dialog-title" title="Error" />
            <DialogContent>
            <Alert severity="error" key={1}><div className="errorAlertDiv" key={"div-1"} >{this.state.message}</div></Alert>
            </DialogContent>
            <DialogActions>
              <Button href="https://github.com/OpenSourceBrain/OSBv2/issues/new" target="_blank">Report feedback</Button>
              <Button variant="outlined" color="primary" onClick={() => window.open("/", "_self")}>Return to homepage</Button>
            </DialogActions>
          </Dialog>

        </>
      );
    }

    // when there's not an error, render children untouched
    return this.props.children;
  }
}

export default OSBErrorBoundary
