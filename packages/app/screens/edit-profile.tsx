import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { EditProfile } from "app/components/edit-profile";
import { useUser } from "app/hooks/use-user";
import { useTrackPageViewed } from "app/lib/analytics";

export const EditProfilePage = () => {
  useTrackPageViewed({ name: "Edit Profile" });
  useUser({
    redirectIfProfileIncomplete: true,
  });

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
