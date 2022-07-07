// This file configures the intialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import { ExtraErrorData, CaptureConsole, Offline } from "@sentry/integrations";
import * as Sentry from "@sentry/nextjs";
import { Integrations as TracingIntegrations } from "@sentry/tracing";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_CLIENT_ENVIRONMENT,
  tracesSampleRate: 0.2,
  integrations: [
    new TracingIntegrations.BrowserTracing({
      tracingOrigins: [process.env.NEXT_PUBLIC_BACKEND_URL],
    }),
    new ExtraErrorData(),
    new CaptureConsole({
      levels: ["warn", "error"],
    }),
    new Offline(),
  ],
});
