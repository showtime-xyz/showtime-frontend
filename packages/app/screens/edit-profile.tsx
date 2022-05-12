import { EditProfile } from "app/components/edit-profile";
import { useTrackPageViewed } from "app/lib/analytics";

import { withModalScreen } from "design-system/modal-screen/with-modal-screen";

export const EditProfilePage = () => {
  useTrackPageViewed({ name: "Edit Profile" });
  return <EditProfile />;
};
export const EditProfileScreen = withModalScreen(EditProfilePage, {
  title: "Edit Profile",
  matchingPathname: "/profile/edit",
  matchingQueryParam: "editProfileModal",
});
