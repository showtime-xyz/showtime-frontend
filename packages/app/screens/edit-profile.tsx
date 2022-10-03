import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { EditProfile } from "app/components/edit-profile";
import { useTrackPageViewed } from "app/lib/analytics";

export const EditProfilePage = () => {
  useTrackPageViewed({ name: "Edit Profile" });
  return <EditProfile />;
};
export const EditProfileScreen = withModalScreen(EditProfilePage, {
  title: "Edit Profile",
  matchingPathname: "/profile/edit",
  matchingQueryParam: "editProfileModal",
  enableContentPanningGesture: false,
  snapPoints: ["100%"],
  disableBackdropPress: true,
  web_height: `h-[90vh]`,
});
