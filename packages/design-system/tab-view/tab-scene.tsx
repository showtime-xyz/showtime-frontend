import React from "react";
import { Platform } from "react-native";

import {
  FlashList as FlashListCore,
  FlashListProps,
  AnimatedFlashList,
} from "@shopify/flash-list";
import Animated from "react-native-reanimated";
import { RecyclerListViewProps } from "recyclerlistview";

import { RecyclerListView } from "app/lib/recyclerlistview";

import { SceneComponent } from "./src/scene";

type TabFlashListProps<T> = FlashListProps<T> & {
  index: number;
};
function FlashList<T>(props: TabFlashListProps<T>, ref: any) {
  return (
    <SceneComponent
      {...props}
      forwardedRef={ref}
      ContainerView={AnimatedFlashList}
    />
  );
}

export const TabFlashList = React.forwardRef(FlashList) as <T>(
  props: TabFlashListProps<T> & {
    ref?: React.Ref<FlashListCore<T>>;
  }
) => React.ReactElement;

const AnimateRecyclerList = Animated.createAnimatedComponent(RecyclerListView);

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
