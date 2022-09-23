import type React from "react";
import type { ComponentClass } from "react";
import type { ScrollViewProps } from "react-native";

import type { NativeGesture } from "react-native-gesture-handler";
import type Animated from "react-native-reanimated";
import type {
  TabViewProps,
  Route as TabViewRoute,
} from "react-native-tab-view-next";

export type Route = TabViewRoute & {
  index: number;
  subtitle?: string | number;
};

export enum RefreshTypeEnum {
  Idle,
  Pending,
  Success,
  Refreshing,
  Finish,
  Cancel,
}

export type CollapsibleHeaderProps<T extends Route> = {
  initHeaderHeight?: number;
  renderScrollHeader?: () => React.ReactElement | null;
  overridenShareAnimatedValue?: Animated.SharedValue<number>;
  overridenTranslateYValue?: Animated.SharedValue<number>;
  initTabbarHeight?: number;
  minHeaderHeight?: number;
  overflowHeight?: number;
  headerRespond?: boolean;
  scrollEnabled?: boolean;
  isRefreshing?: boolean;
  onStartRefresh?: () => void;
  renderRefreshControl?: (
    refreshProps: RefreshControlProps
  ) => React.ReactElement;
  refreshHeight?: number;
  overflowPull?: number;
  pullExtendedCoefficient?: number;
  animationHeaderPosition?: Animated.SharedValue<number>;
  animationHeaderHeight?: Animated.SharedValue<number>;
  panHeaderMaxOffset?: number;
  onPullEnough?: () => void;
  refreshControlColor?: string;
  refreshControlTop?: number;
  emptyBodyComponent?: JSX.Element | null;
  renderSceneHeader?: (props: T) => JSX.Element | null;
};

export type TabViewCustomRenders = {
  renderTabBarContainer: (children: any) => JSX.Element;
  renderSceneHeader: (children: any, props: any) => JSX.Element;
};

export type GestureContainerProps<T extends Route> = Pick<
  TabViewProps<Route>,
  "navigationState"
> &
  CollapsibleHeaderProps<T> & {
    initialPage: number;
    renderTabView: (e: TabViewCustomRenders) => JSX.Element;
  };

export interface RefreshControlProps {
  refreshValue: Animated.SharedValue<number>;
  refreshType: Animated.SharedValue<RefreshTypeEnum>;
  progress: Animated.SharedValue<number>;
  refreshControlColor?: string;
}
export type SceneProps<P extends object> = P & {
  ContainerView: any;
  forwardedRef: any;
  index: number;
  useExternalScrollView?: boolean;
} & ScrollViewProps;

export type UpdateSceneInfoParams = {
  scrollRef: any;
  index: number;
  scrollY: Animated.SharedValue<number>;
};

export type ScrollableView<T> = ComponentClass<T>;

export type ForwardRefType<T> =
  | ((instance: T | null) => void)
  | React.MutableRefObject<T | null>
  | null;

export type GesturePanContext = {
  startY: Animated.SharedValue<number>;
  basyY: Animated.SharedValue<number>;
};
export type TabHeaderContext = {
  isSlidingHeader: Animated.SharedValue<boolean>;
  shareAnimatedValue: Animated.SharedValue<number>;
  isStartRefreshing: Animated.SharedValue<boolean>;
  minHeaderHeight: number;
  tabbarHeight: number;
  headerHeight: number;
  scrollStickyHeaderHeight: number;
  refreshHeight: number;
  overflowPull: number;
  pullExtendedCoefficient: number;
  headerTrans: Animated.SharedValue<number>;
  expectHeight: number;
  refHasChanged: (ref: NativeGesture) => void;
  curIndexValue: Animated.SharedValue<number>;
  updateSceneInfo: (e: UpdateSceneInfoParams) => void;
  scrollViewPaddingTop: number;
} | null;
