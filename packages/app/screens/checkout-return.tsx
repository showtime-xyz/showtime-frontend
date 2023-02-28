import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CheckoutReturn } from "app/components/checkout/checkout-return";

export const CheckoutReturnScreen = withModalScreen(CheckoutReturn, {
  title: "Checkout",
  matchingPathname: "/checkout-return",
  matchingQueryParam: "checkoutReturnModal",
  tw: "w-full lg:w-[500px]",
  disableBackdropPress: true,
  web_height: `max-h-[100vh] md:max-h-[82vh]`,
  snapPoints: ["100%"],
});
