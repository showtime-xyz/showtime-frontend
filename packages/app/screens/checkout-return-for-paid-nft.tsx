import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CheckoutReturnForPaidNFT } from "app/components/checkout/checkout-return-for-paid-nft";

export const CheckoutReturnForPaidNFTScreen = withModalScreen(
  CheckoutReturnForPaidNFT,
  {
    title: "Checkout",
    matchingPathname: "/checkout-return-for-paid-nft",
    matchingQueryParam: "checkoutReturnForPaidNFTModal",
    tw: "w-full lg:w-[500px]",
    disableBackdropPress: true,
    snapPoints: ["100%"],
  }
);
