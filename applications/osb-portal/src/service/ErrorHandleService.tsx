import * as Sentry from '@sentry/react';

export async function initErrorHandler(appName: string) {

    // const commonUrl = window.location.host.replace('www', 'common') + '/api/sentry/getdsn/' + appName;
    // fetch(commonUrl)
    //     .then(response => response.json(), error => console.error("Cannot connect to common service"))
    //     .then(sentryDSN => {
    //         if (sentryDSN) {
    //             Sentry.init({ dsn: sentryDSN.dsn })
    //         }

    //     }, error => console.error("Cannot connect to error monitor"))
}