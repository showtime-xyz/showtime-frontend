import { useState } from "react";

import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CompleteProfileModalContent } from "app/components/complete-profile-modal-content";
import { EditProfile } from "app/components/edit-profile";
import { useUser } from "app/hooks/use-user";
import { useTrackPageViewed } from "app/lib/analytics";

export const EditProfilePage = () => {
  useTrackPageViewed({ name: "Edit Profile" });
  const { isIncompletedProfile } = useUser();
  const [showEditProfile, setShowEditProfile] = useState(isIncompletedProfile);
  if (showEditProfile) {
    return (
      <CompleteProfileModalContent
        onEditProfile={() => setShowEditProfile(false)}
      />
    );
  }

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
