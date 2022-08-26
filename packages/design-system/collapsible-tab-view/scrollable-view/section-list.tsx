import React from "react";
import { SectionList as RNSectionList, SectionListProps } from "react-native";

import Animated from "react-native-reanimated";

import { SceneComponent } from "../scene";

const AnimatePageView = Animated.createAnimatedComponent(RNSectionList);
export type TabSectionListProps<T, SectionT> = SectionListProps<T, SectionT> & {
  index: number;
};

function SectionList<T, SectionT>(
  props: TabSectionListProps<T, SectionT>,
  ref: any
) {
  return (
    <SceneComponent
      {...props}
      forwardedRef={ref}
      ContainerView={AnimatePageView}
    />
  );
}

export const TabSectionList = React.forwardRef(SectionList) as <T, SectionT>(
  props: TabSectionListProps<T, SectionT> & {
    ref?: React.Ref<RNSectionList<T, SectionT>>;
  }
) => React.ReactElement;
