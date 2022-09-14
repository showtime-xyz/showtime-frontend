import { GrowthBook } from "@growthbook/growthbook-react";

export const growthbook = new GrowthBook({
  // TODO:
  trackingCallback: (experiment, result) => {
    // rudder?.track("Experiment Viewed", {
    //   experiment_id: experiment.key,
    //   variant_id: result.variationId,
    // });
  },
});
