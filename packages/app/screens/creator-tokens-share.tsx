import { Platform } from "react-native";

import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CreatorTokensShareModal } from "app/components/creator-token/creator-tokens-share";

export const CreatorTokensShareModalScreen = () => {
  if (Platform.OS !== "web") return <CreatorTokensShareModal />;
  return <CreatorTokensShareWidthModalScreen />;
};

const CreatorTokensShareWidthModalScreen = withModalScreen(
  CreatorTokensShareModal,
  {
    title: "",
    matchingPathname: "/creator-token/[username]/share",
    matchingQueryParam: "creatorTokensShareModal",
    disableBackdropPress: true,
    snapPoints: ["100%"],
    headerShown: false,
    tw: "!pb-0 !bg-transparent",
  }
);
