import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CheckoutPaidNFT } from "app/components/checkout/checkout-paid-nft";

export const CheckoutPaidNFTScreen = withModalScreen(CheckoutPaidNFT, {
  title: "Pay with Card",
  matchingPathname: "/checkout-paid-nft",
  matchingQueryParam: "checkoutPaidNFTModal",
  tw: "w-full lg:w-[500px]",
  disableBackdropPress: true,
  snapPoints: ["100%"],
});
