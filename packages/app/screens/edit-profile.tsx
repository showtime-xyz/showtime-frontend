import { Platform } from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";

import { EditProfile } from "app/components/edit-profile";

import { View } from "design-system";

export const EditProfileScreen = () => {
  const headerHeight = useHeaderHeight();

  return (
    <>
      {Platform.OS !== "android" && <View tw={`h-[${headerHeight}px]`} />}
      <EditProfile />
    </>
  );
};
