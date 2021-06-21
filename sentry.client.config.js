// This file configures the intialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import { ExtraErrorData, CaptureConsole, Offline } from '@sentry/integrations'

Sentry.init({
	dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
	integrations: [new ExtraErrorData(), new CaptureConsole(), new Offline()],
})
