import { Platform } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { useHeaderHeight } from "app/lib/react-navigation/elements";

export const Screen = (props: { children: React.ReactElement }) => {
  const headerHeight = useHeaderHeight();

  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}
      {props.children}
    </>
  );
};
