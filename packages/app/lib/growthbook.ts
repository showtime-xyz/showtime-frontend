import { GrowthBook } from "@growthbook/growthbook-react";

import { track } from "app/lib/analytics";

export const growthbook = new GrowthBook({
  trackingCallback: (experiment, result) => {
    track("Experiment Viewed", {
      experiment_id: experiment.key,
      variant_id: result.variationId,
    });
  },
});
