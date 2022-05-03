import { Platform } from "react-native";

import { EditProfile } from "app/components/edit-profile";
import { useTrackPageViewed } from "app/lib/analytics";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { View } from "design-system";

export const EditProfileScreen = () => {
  useTrackPageViewed({ name: "Edit Profile" });
  const headerHeight = useHeaderHeight();

  return (
    <>
      {Platform.OS === "ios" && <View tw={`h-[${headerHeight}px]`} />}
      <EditProfile />
    </>
  );
};
