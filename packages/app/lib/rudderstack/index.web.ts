import type RudderClient from "@rudderstack/rudder-sdk-react-native";

import { isServer } from "app/lib/is-server";

type WindowAnalytics = {
  rudderanalytics: typeof RudderClient;
};

let rudderanalytics = {};
if (!isServer) {
  rudderanalytics = (window as WindowAnalytics & Window & typeof globalThis)
    ?.rudderanalytics;
  // rudderanalytics = require("rudder-sdk-js");
  const RUDDERSTACK_DATA_PLANE_URL = `https://tryshowtimjtc.dataplane.rudderstack.com`;
  //@ts-ignore
  rudderanalytics.load(
    process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY,
    RUDDERSTACK_DATA_PLANE_URL
  );
}

const rudder = isServer ? {} : rudderanalytics;

export { rudder };
