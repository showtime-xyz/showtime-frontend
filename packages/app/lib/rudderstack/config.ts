import { RUDDER_LOG_LEVEL } from "@rudderstack/rudder-sdk-react-native";

export const rudderConfig = {
  dataPlaneUrl: "https://tryshowtimjtc.dataplane.rudderstack.com",
  trackAppLifecycleEvents: true,
  logLevel: RUDDER_LOG_LEVEL.INFO, // DEBUG
};
