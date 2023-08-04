import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { PayoutsSetup } from "app/components/payouts/payouts-setup";

export const PayoutsSetupScreen = withModalScreen(PayoutsSetup, {
  title: "Payment processing details",
  matchingPathname: "/payouts/setup",
  matchingQueryParam: "payoutsSetup",
  tw: "w-full lg:w-[800px]",
  disableBackdropPress: true,
  snapPoints: ["100%"],
  headerShown: false,
  enableContentPanningGesture: false,
  enableHandlePanningGesture: false,
});
