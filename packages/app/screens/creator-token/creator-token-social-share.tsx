import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CreatorTokenSocialShare } from "app/components/creator-token/creator-token-social-share";

export const CreatorTokenSocialShareScreen = withModalScreen(
  CreatorTokenSocialShare,
  {
    title: "",
    matchingPathname: "/creator-token/[username]/social-share",
    matchingQueryParam: "creatorTokenSocialShareModal",
    snapPoints: ["100%"],
    enableHandlePanningGesture: true,
    enableContentPanningGesture: true,
    useNativeModal: false,
  }
);
