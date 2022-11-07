import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { EditProfile } from "app/components/edit-profile";
import { useTrackPageViewed } from "app/lib/analytics";

export const EditProfilePage = () => {
  useTrackPageViewed({ name: "Complete Profile" });
  return <EditProfile />;
};
export const CompleteProfileScreen = withModalScreen(EditProfilePage, {
  title: "Complete Profile",
  matchingPathname: "/profile/complete",
  matchingQueryParam: "completeProfileModal",
  enableContentPanningGesture: false,
  snapPoints: ["100%"],
  disableBackdropPress: true,
  web_height: `h-[90vh]`,
});
