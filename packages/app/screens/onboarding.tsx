import { Onboarding } from "app/components/onboarding";
import { useTrackPageViewed } from "app/lib/analytics";

import { withModalScreen } from "design-system/modal-screen";

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
  web_height: `h-[90vh]`,
  backPressHandlerEnabled: false,
});
