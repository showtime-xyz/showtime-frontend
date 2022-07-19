// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import { ExtraErrorData, CaptureConsole } from "@sentry/integrations";
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_SERVER_ENVIRONMENT,
  tracesSampleRate: 0.2,
  integrations: [
    new ExtraErrorData(),
    new CaptureConsole({
      levels: ["warn", "error"],
    }),
  ],
});
