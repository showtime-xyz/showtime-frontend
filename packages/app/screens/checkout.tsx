import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { Checkout } from "app/components/checkout";

const CheckoutModal = () => {
  return <Checkout />;
};

export const CheckoutScreen = withModalScreen(CheckoutModal, {
  title: "Checkout",
  matchingPathname: "/checkout",
  matchingQueryParam: "checkoutModal",
  tw: "w-full lg:w-[800px]",
  disableBackdropPress: true,
  web_height: `max-h-[100vh] md:max-h-[82vh]`,
  snapPoints: ["100%"],
});
