import { EditProfile } from "app/components/edit-profile";
import { useUser } from "app/hooks/use-user";
import { useTrackPageViewed } from "app/lib/analytics";

import { withModalScreen } from "design-system/modal-screen";

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
  web_height: `h-[82vh]`,
});
