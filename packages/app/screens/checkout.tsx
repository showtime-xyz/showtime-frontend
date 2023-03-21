import { Checkout } from "app/components/checkout/checkout";

import { withModalScreen } from "design-system/modal-screen";

export const CheckoutScreen = withModalScreen(Checkout, {
  title: "Checkout",
  matchingPathname: "/checkout",
  matchingQueryParam: "checkoutModal",
  tw: "w-full lg:w-[500px]",
  disableBackdropPress: true,
  web_height: `max-h-[100vh] md:max-h-[82vh]`,
  snapPoints: ["100%"],
});
