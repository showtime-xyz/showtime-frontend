import { View } from "@showtime-xyz/universal.view";

import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

export const ScreenContainer = (props: { children: any }) => {
  const bottomBarHeight = usePlatformBottomHeight();
  const headerHeight = useHeaderHeight();

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: bottomBarHeight,
        paddingTop: headerHeight,
      }}
    >
      {props.children}
    </View>
  );
};
