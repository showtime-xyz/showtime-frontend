import { forwardRef } from "react";
import {
  FlatList,
  FlatListProps,
  ScrollView,
  ScrollViewProps,
  SectionList,
  SectionListProps,
} from "react-native";
import { Platform } from "react-native";

import Animated from "react-native-reanimated";
import { RecyclerListViewProps } from "recyclerlistview";

import { RecyclerListView } from "app/lib/recyclerlistview";

import { createCollapsibleScrollView } from "./src/create-collapsible-scroll-view";
import { SceneComponent } from "./src/scene";
import { SceneProps } from "./src/types";

export const TabScrollView = createCollapsibleScrollView<
  typeof ScrollView,
  ScrollViewProps
>(ScrollView);

// Todo: Imporve ts type (support generics type)
export const TabFlatList = createCollapsibleScrollView<
  typeof FlatList,
  FlatListProps<any>
>(FlatList);

// Todo: Imporve ts type (support generics type)
export const TabSectionList = createCollapsibleScrollView<
  typeof SectionList,
  SectionListProps<any>
>(SectionList);

const AnimateRecyclerList = Animated.createAnimatedComponent(RecyclerListView);

export const TabRecyclerList = forwardRef<
  typeof RecyclerListView,
  Omit<SceneProps<RecyclerListViewProps>, "ContainerView" | "forwardedRef">
>(function TabRecyclerList(props, ref) {
  return (
    <SceneComponent<RecyclerListViewProps>
      {...props}
      forwardedRef={ref}
      scrollViewProps={props}
      useWindowScroll={Platform.OS === "web"}
      ContainerView={AnimateRecyclerList}
    />
  );
});
