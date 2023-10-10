import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { InviteCreatorToken } from "app/components/creator-token/invite-creator-token";

export const InviteCreatorTokenScreen = withModalScreen(InviteCreatorToken, {
  title: "Invite friends",
  matchingPathname: "/profile/invite-creator-token",
  matchingQueryParam: "inviteCreatorToken",
  snapPoints: ["100%"],
  tw: "w-full sm:w-[400px] md:w-[400px] lg:w-[400px] xl:w-[400px]",
  disableBackdropPress: true,
});
