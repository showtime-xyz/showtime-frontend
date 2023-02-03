import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CheckoutModal } from "./test-modal";

export const CheckoutScreen = withModalScreen(CheckoutModal, {
  title: "Checkout",
  matchingPathname: "/checkout",
  matchingQueryParam: "checkoutModal",
  tw: "w-full lg:w-[500px]",
  disableBackdropPress: true,
  web_height: `max-h-[100vh] md:max-h-[82vh]`,
  snapPoints: ["100%"],
});
