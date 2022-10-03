import React, {
  useCallback,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";

import { useSharedValue } from "react-native-reanimated";
import {
  NavigationState,
  SceneRendererProps,
  TabBar,
  TabView,
  TabViewProps,
} from "react-native-tab-view-next";
import Sticky from "react-stickynode";

import { HeaderTabContext } from "./context";
import { useSceneInfo } from "./hooks";
import type {
  CollapsibleHeaderProps,
  Route,
  TabViewCustomRenders,
} from "./types";

export {
  TabFlatList,
  TabScrollView,
  TabSectionList,
  TabScrollViewProps,
  TabFlatListProps,
  TabSectionListProps,
} from "./scrollable-view";

export type HeaderTabViewRef = {};
export type HeaderTabViewProps<T extends Route> = Partial<TabViewProps<T>> &
  Pick<TabViewProps<T>, "onIndexChange" | "navigationState" | "renderScene"> &
  CollapsibleHeaderProps<T>;

export function createCollapsibleTabsComponent() {
  return React.forwardRef(CollapsibleHeaderTabView);
}
enum StatusCode {
  /** The default status, located at the original position. */
  STATUS_ORIGINAL = 0,

  /**
   * The released status, located at somewhere on document, but not
   * default one.
   */
  STATUS_RELEASED = 1,
  STATUS_FIXED = 2,
}
function CollapsibleHeaderTabView<T extends Route>(
  {
    renderTabBar,
    overflowHeight = 0,
    renderScrollHeader,
    initTabbarHeight = 44,
    minHeaderHeight = 0,
    navigationState,
    emptyBodyComponent,
    renderScene,
    renderSceneHeader,
    ...restProps
  }: HeaderTabViewProps<T>,
  ref?: any
) {
  const shareAnimatedValue = useSharedValue(0);
  const headerTrans = useSharedValue(0);
  const curIndexValue = useSharedValue(navigationState.index);
  const isSlidingHeader = useSharedValue(false);
  const isStartRefreshing = useSharedValue(false);

  // layout
  const [tabbarHeight, setTabbarHeight] = useState(initTabbarHeight);

  const containeRef = useRef(null);
  useImperativeHandle(ref, () => ({}), []);
  const tabbarOnLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) => {
      if (overflowHeight > height) {
        console.warn("overflowHeight must be less than the tabbar height");
      }
      if (Math.abs(tabbarHeight - height) < 1) return;
      setTabbarHeight(height);
    },
    [tabbarHeight, overflowHeight]
  );
  const _renderTabBar = useCallback(
    (
      tabbarProps: SceneRendererProps & {
        navigationState: NavigationState<T>;
      }
    ) => {
      return renderTabBar ? (
        renderTabBar(tabbarProps)
      ) : (
        <TabBar {...tabbarProps} />
      );
    },
    [renderTabBar]
  );

  const renderTabView = (e: TabViewCustomRenders) => {
    return (
      <TabView
        navigationState={navigationState}
        {...restProps}
        renderTabBar={(
          tabbarProps: SceneRendererProps & {
            navigationState: NavigationState<T>;
          }
        ) => e.renderTabBarContainer(_renderTabBar(tabbarProps))}
        renderScene={(props: any) =>
          e.renderSceneHeader(renderScene(props), props)
        }
      />
    );
  };

  const _renderTabBarContainer = (children: React.ReactElement) => {
    return (
      <View style={styles.tabbarStyle}>
        <Sticky enabled={true} top={minHeaderHeight}>
          <View onLayout={tabbarOnLayout}>{children}</View>
        </Sticky>
      </View>
    );
  };
  const _renderSceneHeader = (
    children: React.ReactElement,
    props: SceneRendererProps & { route: T }
  ) => {
    return (
      <View style={styles.full}>
        {renderSceneHeader?.(props.route)}
        {children}
      </View>
    );
  };

  const { updateSceneInfo } = useSceneInfo(curIndexValue);
  return (
    <HeaderTabContext.Provider
      value={{
        shareAnimatedValue,
        headerTrans,
        tabbarHeight,
        expectHeight: 0,
        headerHeight: 0,
        refreshHeight: 0,
        overflowPull: 0,
        pullExtendedCoefficient: 0,
        refHasChanged: () => false,
        curIndexValue,
        minHeaderHeight,
        updateSceneInfo,
        isSlidingHeader,
        isStartRefreshing,
        scrollStickyHeaderHeight: 0,
        scrollViewPaddingTop: 0,
      }}
    >
      <View ref={containeRef} style={styles.full}>
        {renderScrollHeader && renderScrollHeader()}
        {navigationState.routes.length === 0 && emptyBodyComponent ? (
          <View style={{ marginTop: tabbarHeight }}>{emptyBodyComponent}</View>
        ) : (
          renderTabView({
            renderTabBarContainer: _renderTabBarContainer,
            renderSceneHeader: _renderSceneHeader,
          })
        )}
      </View>
    </HeaderTabContext.Provider>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  tabbarStyle: {
    zIndex: 1,
  },
});
