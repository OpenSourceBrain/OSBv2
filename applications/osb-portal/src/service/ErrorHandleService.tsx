import * as Sentry from "@sentry/react";

export async function initErrorHandler(appName: string) {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    // No DSN configured for this deployment: leave Sentry uninitialized.
    return;
  }

  Sentry.init({
    dsn,
    sampleRate: Number(import.meta.env.VITE_SENTRY_SAMPLE_RATE),
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE),
  });
  // Preserve the per-app attribution the previous per-app DSN provided.
  Sentry.setTag("app", appName);
}
