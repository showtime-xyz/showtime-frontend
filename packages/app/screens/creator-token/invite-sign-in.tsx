import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CreatorTokenInviteSignIn } from "app/components/creator-token/invite-sign-in";

export const CreatorTokenInviteSignInScreen = withModalScreen(
  CreatorTokenInviteSignIn,
  {
    title: "",
    matchingPathname: "/creator-token/[username]/invite-sign-in",
    matchingQueryParam: "creatorTokenInviteSignInModal",
    enableContentPanningGesture: true,
    enableHandlePanningGesture: true,
    headerShown: true,
    snapPoints: ["75%"],
    disableBackdropPress: false,
    backPressHandlerEnabled: true,
    useNativeModal: false,
  }
);
