import React from "react";
import { Platform, ScrollViewProps } from "react-native";

import Animated from "react-native-reanimated";

import {
  RecyclerListView,
  RecyclerListViewProps,
} from "app/lib/recyclerlistview";

import { SceneComponent } from "./src/scene";

const AnimateRecyclerList = Animated.createAnimatedComponent(RecyclerListView);

type TabScrollViewProps = ScrollViewProps & {
  index: number;
};
function TabFlashListScrollViewComponent(props: TabScrollViewProps, ref: any) {
  return (
    <SceneComponent
      {...props}
      forwardedRef={ref}
      ContainerView={Animated.ScrollView}
    />
  );
}

export const TabFlashListScrollView = React.forwardRef(
  TabFlashListScrollViewComponent
);

function RecyclerList(props: any, ref: any) {
  return (
    <SceneComponent<any>
      {...props}
      forwardedRef={ref}
      scrollViewProps={props}
      useWindowScroll={Platform.OS === "web"}
      ContainerView={AnimateRecyclerList}
    />
  );
}

export const TabRecyclerList = React.forwardRef(RecyclerList) as (
  props: RecyclerListViewProps & {
    ref?: React.Ref<typeof RecyclerListView>;
    index: number;
  }
) => React.ReactElement;
