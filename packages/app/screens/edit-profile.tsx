import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { EditProfile } from "app/components/edit-profile";
import { useAuthScreen } from "app/hooks/use-auth-screen";
import { useTrackPageViewed } from "app/lib/analytics";

export const EditProfilePage = () => {
  useTrackPageViewed({ name: "Edit Profile" });
  useAuthScreen();

  return <EditProfile />;
};
export const EditProfileScreen = withModalScreen(EditProfilePage, {
  title: "Edit Profile",
  matchingPathname: "/profile/edit",
  matchingQueryParam: "editProfileModal",
  enableContentPanningGesture: false,
  snapPoints: ["100%"],
  disableBackdropPress: true,
});
