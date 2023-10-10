import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { BuyCreatorToken } from "app/components/creator-token/buy-creator-token";

export const CreatorTokenBuyScreen = withModalScreen(BuyCreatorToken, {
  title: "",
  matchingPathname: "/creator-token/buy",
  matchingQueryParam: "creatorTokenBuyModal",
  snapPoints: ["100%"],
  tw: "w-full sm:w-[400px] md:w-[400px] lg:w-[400px] xl:w-[400px]",
});
