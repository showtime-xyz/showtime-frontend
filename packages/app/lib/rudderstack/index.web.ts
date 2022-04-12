import { isServer } from "app/lib/is-server";

let rudderanalytics = {};
if (!isServer) {
  rudderanalytics = require("rudder-sdk-js");

  const RUDDERSTACK_WRITE_KEY = "24xZi2jcoPBdiBSThcM5JB0pUyr";
  const RUDDERSTACK_DATA_PLANE_URL = `https://tryshowtimjtc.dataplane.rudderstack.com`;

  //@ts-ignore
  rudderanalytics.load(RUDDERSTACK_WRITE_KEY, RUDDERSTACK_DATA_PLANE_URL);
}

const rudder = isServer ? {} : rudderanalytics;

export { rudder };
