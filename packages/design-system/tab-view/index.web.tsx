import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  FlatList,
  FlatListProps,
  LayoutChangeEvent,
  ScrollView,
  ScrollViewProps,
  SectionList,
  SectionListProps,
  StyleSheet,
  View,
} from "react-native";

import { useSharedValue } from "react-native-reanimated";
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
  TabViewProps,
} from "react-native-tab-view";
import Sticky from "react-stickynode";

import { HeaderTabContext } from "./context";
import { createCollapsibleScrollView } from "./create-collapsible-scrollView";
import { useSceneInfo } from "./hooks";
import type { CollapsibleHeaderProps } from "./types";

export const TabScrollView = createCollapsibleScrollView<
  typeof ScrollView,
  ScrollViewProps
>(ScrollView);

export const TabFlatList = createCollapsibleScrollView<
  typeof FlatList,
  FlatListProps<any>
>(FlatList);

export const TabSectionList = createCollapsibleScrollView<
  typeof SectionList,
  SectionListProps<any>
>(SectionList);
export const HeaderTabView = React.forwardRef(CollapsibleHeaderTabView);

export type HeaderTabViewRef = {};
export type HeaderTabViewProps<T extends Route> = Partial<TabViewProps<T>> &
  Pick<TabViewProps<T>, "onIndexChange" | "navigationState" | "renderScene"> &
  CollapsibleHeaderProps;

function CollapsibleHeaderTabView<T extends Route>(
  {
    renderTabBar,
    overflowHeight = 0,
    renderScrollHeader,
    initHeaderHeight = 0,
    initTabbarHeight = 44,
    minHeaderHeight = 0,
    animationHeaderHeight,
    navigationState,
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
  const [tabviewHeight, setTabviewHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(
    initHeaderHeight - overflowHeight
  );
  const calcHeight = useMemo(
    () => headerHeight - minHeaderHeight,
    [headerHeight, minHeaderHeight]
  );
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
  const containerOnLayout = useCallback((event: LayoutChangeEvent) => {
    setTabviewHeight(event.nativeEvent.layout.height);
  }, []);
  const headerOnLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (headerHeight === event.nativeEvent.layout.height) return;
      const height = event.nativeEvent.layout.height - overflowHeight;
      setHeaderHeight(height);
      if (animationHeaderHeight) {
        animationHeaderHeight.value = calcHeight - minHeaderHeight;
      }
    },
    [
      animationHeaderHeight,
      calcHeight,
      headerHeight,
      minHeaderHeight,
      overflowHeight,
    ]
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

  const renderTabView = (e: { renderTabBarContainer: any }) => {
    return (
      <TabView
        navigationState={navigationState}
        {...restProps}
        renderTabBar={(tabbarProps: any) =>
          e.renderTabBarContainer(_renderTabBar(tabbarProps))
        }
      />
    );
  };
  const _renderTabBarContainer = (children: React.ReactElement) => {
    return (
      <View style={styles.tabbarStyle}>
        <View style={styles.container}>
          {renderScrollHeader && (
            <View onLayout={headerOnLayout}>{renderScrollHeader()}</View>
          )}
          <Sticky enabled={true} top={0}>
            <View onLayout={tabbarOnLayout}>{children}</View>
          </Sticky>
        </View>
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
        expectHeight: Math.floor(
          headerHeight + tabviewHeight - minHeaderHeight
        ),
        headerHeight,
        refreshHeight: 0,
        overflowPull: 0,
        pullExtendedCoefficient: 0,
        refHasChanged: () => false,
        curIndexValue,
        minHeaderHeight,
        updateSceneInfo,
        isSlidingHeader,
        isStartRefreshing,
      }}
    >
      <View style={styles.container}>
        <View style={styles.container} onLayout={containerOnLayout}>
          {renderTabView({
            renderTabBarContainer: _renderTabBarContainer,
          })}
        </View>
      </View>
    </HeaderTabContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  tabbarStyle: {
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 10,
  },
});
