import React from "react";
import { ScrollViewProps } from "react-native";

import Animated from "react-native-reanimated";

import { SceneComponent } from "@showtime-xyz/universal.collapsible-tab-view";

type TabScrollViewProps = ScrollViewProps & {
  index: number;
};
function TabFlashListScrollViewComponent(props: TabScrollViewProps, ref: any) {
  return (
    <SceneComponent
      {...props}
      useExternalScrollView
      forwardedRef={ref}
      ContainerView={Animated.ScrollView}
    />
  );
}

export const TabFlashListScrollView = React.forwardRef(
  TabFlashListScrollViewComponent
);
