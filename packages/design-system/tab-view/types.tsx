import type React from "react";
import type { ComponentClass } from "react";
import type { ScrollViewProps } from "react-native";

import type { NativeGesture } from "react-native-gesture-handler";
import type Animated from "react-native-reanimated";
import type { Route as TabViewRoute } from "react-native-tab-view";

export type Route = TabViewRoute & {
  index: number;
};

export enum RefreshTypeEnum {
  Idle,
  Pending,
  Success,
  Refreshing,
  Finish,
  Cancel,
}

export type CollapsibleHeaderProps = {
  initHeaderHeight?: number;
  renderScrollHeader: () => React.ReactElement | null;
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
};

export type GestureContainerProps = CollapsibleHeaderProps & {
  initialPage: number;
  renderTabView: any;
};

export interface RefreshControlProps {
  refreshValue: Animated.SharedValue<number>;
  refreshType: Animated.SharedValue<RefreshTypeEnum>;
  progress: Animated.SharedValue<number>;
  refreshControlColor?: string;
}

export type SceneProps<P extends object> = {
  ContainerView: React.ComponentClass<Animated.AnimateProps<P>>;
  forwardedRef: any;
  index: number;
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
  refreshHeight: number;
  overflowPull: number;
  pullExtendedCoefficient: number;
  headerTrans: Animated.SharedValue<number>;
  expectHeight: number;
  refHasChanged: (ref: NativeGesture) => void;
  curIndexValue: Animated.SharedValue<number>;
  updateSceneInfo: (e: UpdateSceneInfoParams) => void;
} | null;
