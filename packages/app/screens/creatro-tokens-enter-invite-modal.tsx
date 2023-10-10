import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { EnterInviteCodeModal } from "app/components/profile/enter-invite-code-modal";

export const EnterInviteCodeModalScreen = withModalScreen(
  EnterInviteCodeModal,
  {
    title: "",
    matchingPathname: "/enterInviteCode",
    matchingQueryParam: "enterInviteCodeModal",
    tw: "w-full md:w-[420px] web:lg:pb-8",
    snapPoints: [320],
    useNativeModal: false,
  }
);
