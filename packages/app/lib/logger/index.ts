import { captureException, captureMessage } from "../sentry";

export const Logger = {
  log: (...args: any) => {
    if (__DEV__) {
      console.log(...args);
    } else {
      captureMessage(args);
    }
  },

  error: (...args: any) => {
    if (__DEV__) {
      console.error(...args);
    } else {
      captureException(args);
    }
  },
  warn: (...args: any) => {
    if (__DEV__) {
      console.warn(...args);
    }
  },
};
