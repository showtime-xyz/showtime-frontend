import { isServer } from "app/lib/is-server";

export interface Analytics {
  page: (url: string) => void;
  track: (
    action: string,
    props?: Record<string, any>,
    options?: Record<string, any>
  ) => void;
  identify: (userId: number, traits: Record<string, any>) => void;
  ready: (callback: () => void) => void;
  reset: () => void;
}

export interface AnalyticsWindow extends Window {
  rudderanalytics: Analytics;
}

const rudder = isServer
  ? {}
  : (window as Window as AnalyticsWindow).rudderanalytics;

export { rudder };
