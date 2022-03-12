import { useHeaderHeight } from "@react-navigation/elements";

import { EditProfile } from "app/components/edit-profile";

import { View } from "design-system";

export const EditProfileScreen = () => {
  const headerHeight = useHeaderHeight();

  return (
    <>
      <View tw={`h-[${headerHeight}px]`} />
      <EditProfile />
    </>
  );
};
