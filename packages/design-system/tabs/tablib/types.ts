import React from "react";
import { Animated, LayoutRectangle } from "react-native";
import PagerView from "react-native-pager-view";
import Reanimated from "react-native-reanimated";
import { ScrollViewProps } from "react-native";

export type TabRootProps = {
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  tabListHeight?: number;
  children: React.ReactNode;
  lazy?: boolean;
  accessibilityLabel?: string;
};

export type TabListProps = ScrollViewProps;

export type RefreshGestureState =
  | "idle"
  | "pulling"
  | "refreshing"
  | "cancelling";

export type TabsContextType = {
  tabListHeight: number;
  pullToRefreshY: Reanimated.SharedValue<number>;
  refreshGestureState: Reanimated.SharedValue<RefreshGestureState>;
  index: Reanimated.SharedValue<number>;
  tabItemLayouts: Array<Reanimated.SharedValue<LayoutRectangle | null>>;
  tablistScrollRef: React.RefObject<Reanimated.ScrollView>;
  requestOtherViewsToSyncTheirScrollPosition: Reanimated.SharedValue<boolean>;
  translateY: Reanimated.SharedValue<number>;
  scrollY: Reanimated.SharedValue<number>;
  offset: Animated.Value;
  position: Animated.Value;
  headerHeight: number;
  initialIndex: number;
  onIndexChange: (index: number) => void;
  pagerRef: React.RefObject<PagerView>;
  lazy?: boolean;
};
