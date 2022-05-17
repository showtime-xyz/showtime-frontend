import { useEffect } from "react";

import { GrowthBook } from "@growthbook/growthbook-react";
import rudderClient, {
  RUDDER_LOG_LEVEL,
} from "@rudderstack/rudder-sdk-react-native";

import { track } from "app/lib/analytics";
import LogRocket from "app/lib/logrocket";

const rudderConfig = {
  dataPlaneUrl: "https://tryshowtimjtc.dataplane.rudderstack.com",
  trackAppLifecycleEvents: true,
  logLevel: RUDDER_LOG_LEVEL.INFO, // DEBUG
};

// Create a GrowthBook instance
const growthbook = new GrowthBook({
  trackingCallback: (experiment, result) => {
    track("Experiment Viewed", {
      experiment_id: experiment.key,
      variant_id: result.variationId,
    });
  },
});

export const useAnalyticTools = () => {
  useEffect(() => {
    if (process.env.STAGE !== "development") {
      LogRocket.init("oulg1q/showtime", {
        redactionTags: ["data-private"],
      });
    }
  }, []);

  useEffect(() => {
    const initAnalytics = async () => {
      await rudderClient.setup(
        process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY,
        rudderConfig
      );
    };

    initAnalytics();
  }, []);

  useEffect(() => {
    fetch(process.env.GROWTHBOOK_FEATURES_ENDPOINT)
      .then((res) => res.json())
      .then((json) => {
        growthbook.setFeatures(json.features);
      });
  }, []);

  return null;
};
