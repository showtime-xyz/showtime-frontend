import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { RaffleModal } from "app/components/raffle";

export const RaffleScreen = withModalScreen(RaffleModal, {
  title: "",
  matchingPathname: "/raffle/[contractAddress]",
  matchingQueryParam: "raffleModal",
  snapPoints: ["100%"],
});
