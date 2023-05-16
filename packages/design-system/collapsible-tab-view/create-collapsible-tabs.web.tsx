import React, {
  useCallback,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";

import {
  NavigationState,
  SceneRendererProps,
  TabBar,
  TabView,
  TabViewProps,
} from "react-native-tab-view";

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

function CollapsibleHeaderTabView<T extends Route>(
  {
    renderTabBar: renderTabBarProp,
    renderScrollHeader,
    initTabbarHeight = 44,
    minHeaderHeight = 0,
    navigationState,
    emptyBodyComponent,
    renderScene,
    renderSceneHeader: renderSceneHeaderProp,
    ...restProps
  }: HeaderTabViewProps<T>,
  ref?: any
) {
  const shareAnimatedValue = { value: 0 };
  const headerTrans = { value: 0 };
  const curIndexValue = { value: 0 };
  const isSlidingHeader = { value: false };
  const isStartRefreshing = { value: false };

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
      if (Math.abs(tabbarHeight - height) < 1) return;
      setTabbarHeight(height);
    },
    [tabbarHeight]
  );
  const renderTabBar = useCallback(
    (
      tabbarProps: SceneRendererProps & {
        navigationState: NavigationState<T>;
      }
    ) => {
      return renderTabBarProp ? (
        renderTabBarProp(tabbarProps)
      ) : (
        <TabBar {...tabbarProps} />
      );
    },
    [renderTabBarProp]
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
        ) => e.renderTabBarContainer(renderTabBar(tabbarProps))}
        renderScene={(props: any) =>
          e.renderSceneHeader(renderScene(props), props)
        }
      />
    );
  };

  const renderTabBarContainer = (children: React.ReactElement) => {
    return (
      <View style={styles.tabbarStyle}>
        <View onLayout={tabbarOnLayout}>{children}</View>
      </View>
    );
  };
  const renderSceneHeader = (
    children: React.ReactElement,
    props: SceneRendererProps & { route: T }
  ) => {
    return (
      <View style={styles.full}>
        {renderSceneHeaderProp?.(props.route)}
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
            renderTabBarContainer: renderTabBarContainer,
            renderSceneHeader: renderSceneHeader,
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
