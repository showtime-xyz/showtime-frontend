import dynamic from "next/dynamic";

import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { useUser } from "app/hooks/use-user";
import { useTrackPageViewed } from "app/lib/analytics";

const EditProfile = dynamic(() => import("app/components/edit-profile"), {
  ssr: false,
});

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
