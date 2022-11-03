import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { ProfileScialExplanation } from "app/components/profile/profile-social-explanation";

export const ProfileScialExplanationScreen = withModalScreen(
  ProfileScialExplanation,
  {
    title: "Profile Scial",
    matchingPathname: "/profile/edit-social-explanation",
    matchingQueryParam: "profileScialExplanationModal",
    snapPoints: [240],
    useNativeModal: false,
  }
);
