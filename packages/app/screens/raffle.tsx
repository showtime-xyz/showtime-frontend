import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { Raffle } from "app/components/raffle";

export const RaffleScreen = withModalScreen(Raffle, {
  title: "",
  matchingPathname: "/raffle/[contractAddress]",
  matchingQueryParam: "raffleModal",
  snapPoints: ["98%"],
});
