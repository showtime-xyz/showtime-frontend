import React from "react";
import { ScrollView as RNScrollView, ScrollViewProps } from "react-native";

import Animated from "react-native-reanimated";

import { SceneComponent } from "../scene";

const AnimatePageView = Animated.createAnimatedComponent(RNScrollView);

export type TabScrollViewProps = ScrollViewProps & {
  index: number;
};

function ScrollView(props: TabScrollViewProps, ref: any) {
  return (
    <SceneComponent
      {...props}
      forwardedRef={ref}
      ContainerView={AnimatePageView}
    />
  );
}

export const TabScrollView = React.forwardRef(ScrollView) as (
  props: TabScrollViewProps & {
    ref?: React.Ref<RNScrollView>;
  }
) => React.ReactElement;
