import React from 'react';
import * as Sentry from '@sentry/react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import Button from '@material-ui/core/Button';

interface OwnState {
  eventId: string;
  hasError: string;
}

class SentryErrorBoundary extends React.Component<{}, OwnState> {
  public state: OwnState = {
    eventId: null,
    hasError: null
  };

  constructor (props: any) {
    super(props);
  }

  static getDerivedStateFromError () {
    return { hasError: true };
  }

  componentDidCatch (error: any, errorInfo: any) {
    Sentry.withScope((scope: any) => {
      scope.setExtras(errorInfo);
      const eventId: string = Sentry.captureException(error);
      this.setState({...this.state, eventId});
    });
  }

  showDialog() {
    Sentry.showReportDialog({ eventId: this.state.eventId });
  }

  render () {
    if (this.state.hasError) {
      // render fallback UI
      return (
        <>
          <Box textAlign='center'>
            <Box padding={2}>
              <Typography align="center" display="block" variant="h4" color="textPrimary">Oops. Something went wrong.</Typography>
            </Box>
            <Box padding={2}>
              <Button variant="outlined" onClick={this.showDialog}>Report feedback</Button>
              <Button variant="outlined" color="primary" onClick={() => window.open("/", "_self")}>Return to homepage</Button>
            </Box>
          </Box>
        </>
      );
    }

    // when there's not an error, render children untouched
    return this.props.children;
  }
}

export default SentryErrorBoundary
