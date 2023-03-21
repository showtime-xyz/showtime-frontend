import { Platform } from "react-native";

import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { View } from "design-system/view";

export const Screen = (props: { children: React.ReactElement }) => {
  const headerHeight = useHeaderHeight();

  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}
      {props.children}
    </>
  );
};
