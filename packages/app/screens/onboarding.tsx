import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { Onboarding } from "app/components/onboarding";
import { useTrackPageViewed } from "app/lib/analytics";

export const OnboardingPage = () => {
  useTrackPageViewed({ name: "Onboarding" });
  return <Onboarding />;
};
export const OnboardingScreen = withModalScreen(OnboardingPage, {
  title: "",
  matchingPathname: "/profile/onboarding",
  matchingQueryParam: "onboardingModal",
  enableContentPanningGesture: false,
  enableHandlePanningGesture: false,
  headerShown: false,
  snapPoints: ["100%"],
  disableBackdropPress: true,
  backPressHandlerEnabled: false,
});
