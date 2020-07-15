import * as Sentry from '@sentry/react';

export async function initErrorHandler(appName: string) {

    const commonUrl = window.location.host.replace('www', 'common') + '/api/sentry/getdsn/' + appName;
    fetch(commonUrl)
        .then(response => response.json())
        .then(sentryDSN => {
            if (sentryDSN) {
                Sentry.init({ dsn: sentryDSN.dsn })
            }

        })
}