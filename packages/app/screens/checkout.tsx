import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { Checkout } from "app/components/checkout/checkout";

export const CheckoutScreen = withModalScreen(Checkout, {
  title: "Checkout",
  matchingPathname: "/checkout",
  matchingQueryParam: "checkoutModal",
  tw: "w-full lg:w-[500px]",
  disableBackdropPress: true,
  snapPoints: ["100%"],
});
