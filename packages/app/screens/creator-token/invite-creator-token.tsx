import { Platform } from "react-native";

import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { InviteCreatorToken } from "app/components/creator-token/invite-creator-token";

const InviteCreatorTokenModal = withModalScreen(InviteCreatorToken, {
  title: "",
  matchingPathname: "/creator-token/invite-creator-token",
  matchingQueryParam: "inviteCreatorTokenModal",
  disableBackdropPress: true,
  snapPoints: ["100%"],
});

export const InviteCreatorTokenScreen = () => {
  if (Platform.OS === "web") {
    return <InviteCreatorTokenModal />;
  }
  return <InviteCreatorToken />;
};
