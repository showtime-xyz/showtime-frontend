import { CheckoutReturn } from "app/components/checkout/checkout-return";

import { withModalScreen } from "design-system/modal-screen";

export const CheckoutReturnScreen = withModalScreen(CheckoutReturn, {
  title: "Checkout",
  matchingPathname: "/checkout-return",
  matchingQueryParam: "checkoutReturnModal",
  tw: "w-full lg:w-[500px]",
  disableBackdropPress: true,
  web_height: `max-h-[100vh] md:max-h-[82vh]`,
  snapPoints: ["100%"],
});
