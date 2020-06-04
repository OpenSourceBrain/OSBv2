import React from 'react';
import * as Sentry from '@sentry/browser';

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
        <Button onClick={this.showDialog}>Report feedback</Button>
      );
    }

    // when there's not an error, render children untouched
    return this.props.children;
  }
}

export default SentryErrorBoundary