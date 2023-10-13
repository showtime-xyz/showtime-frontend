import { Platform } from "react-native";

import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { ImportedAllowlistSuccess } from "app/components/profile/imported-allowlist-succeeded";

export const CreatorTokensImportAllowlistSuccessScreen = () => {
  if (Platform.OS !== "web") return <ImportedAllowlistSuccess />;
  return <CreatorTokensShareWidthModalScreen />;
};

const CreatorTokensShareWidthModalScreen = withModalScreen(
  ImportedAllowlistSuccess,
  {
    title: "",
    matchingPathname: "/creator-token/imported-allowlist-succeeded",
    matchingQueryParam: "creatorTokensImportedAllowlistSuccessModal",
    disableBackdropPress: true,
    snapPoints: ["100%"],
  }
);
