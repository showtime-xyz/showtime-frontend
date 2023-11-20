import { Platform } from "react-native";

import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { SelfServeExplainer } from "app/components/creator-token/self-serve-explainer";
import { withColorScheme } from "app/components/memo-with-theme";
import { useAuthScreen } from "app/hooks/use-auth-screen";
import { useTrackPageViewed } from "app/lib/analytics";

const SelfServeExplainerScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Creator Tokens self serve explainer" });
  useAuthScreen();

  return <SelfServeExplainer />;
});

const CreatorTokensSelfServeExplainerModal = withModalScreen(
  SelfServeExplainerScreen,
  {
    title: "",
    matchingPathname: "/creator-token/self-serve-explainer",
    matchingQueryParam: "creatorTokensSelfServeExplainerModal",
    disableBackdropPress: true,
    tw: "md:max-h-[100vh]",
  }
);
export const CreatorTokensSelfServeExplainerScreen =
  Platform.OS === "web"
    ? CreatorTokensSelfServeExplainerModal
    : SelfServeExplainerScreen;
