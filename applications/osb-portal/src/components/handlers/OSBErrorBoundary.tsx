import React from "react";
import * as Sentry from "@sentry/react";
import Alert from '@mui/material/Alert';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface OSBErrorBoundaryProps {
  error?: any;
}

interface OwnState {
  eventId: string;
  hasError: string;
  message: string;
}

const ERROR_MESSAGES: any = {
  // 401
  UNAUTHORIZED:
    "Oops. This resource could not be accessed. Please check that you are logged in and have the necessary permissions to access this content.",
  // 403
  FORBIDDEN:
    "Oops. This resource could not be accessed. Please check that you have the necessary permissions to access this content.",
  // 404
  "NOT FOUND":
    "Oops. This resource could not be found. Please check the URL you are trying to access and try again.",
  // User 404
  "USER_NOT_FOUND":
    "Oops. This user could not be found. Please check the URL you are trying to access and try again.",
};

class OSBErrorBoundary extends React.Component<OSBErrorBoundaryProps, OwnState> {
  public state: OwnState = {
    eventId: null,
    hasError: null,
    message: null,
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

      let message =
        "Oops. Something went wrong. Please report this error to us.";
      if (window.location.pathname.startsWith("/user/")) {
        message = ERROR_MESSAGES["USER_NOT_FOUND"];
      } else if (error.status && error.status < 500) {
        message = ERROR_MESSAGES[error.statusText] || error.statusText;
      } else {
        Sentry.captureException(error);
      }
      this.setState({ ...this.state, message });
    });
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (nextProps.error) {
      return { ...prevState, hasError: 'true', message: nextProps.error };
    }
    return { ...prevState };
  }

  render() {
    if (this.state.hasError) {
      // render fallback UI
      return (
        <>
          <Dialog open={true}>
            <DialogTitle id="alert-dialog-title" title="Error" />
            <DialogContent>
              <Alert severity="error" key={1}>
                <div className="errorAlertDiv" key={"div-1"}>
                  {this.state.message}
                </div>
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button
                href="https://status.opensourcebrain.org/"
                target="_blank"
              >
                Check system status
              </Button>
              <Button
                href="https://github.com/OpenSourceBrain/OSBv2/issues/new"
                target="_blank"
              >
                Report error
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => window.open("/", "_self")}
              >
                Return to homepage
              </Button>
            </DialogActions>
          </Dialog>
        </>
      );
    }

    // when there's not an error, render children untouched
    return <>{this.props.children}</>;
  }
}

export default OSBErrorBoundary;
