import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CompleteProfileModalContent } from "app/components/complete-profile-modal-content";

function CompleteProfileModal() {
  return <CompleteProfileModalContent />;
}
export const CompleteProfilePromptScreen = withModalScreen(
  CompleteProfileModal,
  {
    title: "Complete Profile",
    matchingPathname: "/profile/complete-prompt",
    matchingQueryParam: "completeProfilePromptModal",
    enableContentPanningGesture: false,
    snapPoints: ["100%"],
    disableBackdropPress: true,
    web_height: `h-[440px]`,
  }
);
