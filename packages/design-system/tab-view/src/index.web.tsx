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
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
  TabViewProps,
} from "react-native-tab-view/src";
import Sticky from "react-stickynode";

import { HeaderTabContext } from "./context";
import { useSceneInfo } from "./hooks";
import type { CollapsibleHeaderProps } from "./types";

export const HeaderTabViewComponent = React.forwardRef(
  CollapsibleHeaderTabView
);

export type HeaderTabViewRef = {};
export type HeaderTabViewProps<T extends Route> = Partial<TabViewProps<T>> &
  Pick<TabViewProps<T>, "onIndexChange" | "navigationState" | "renderScene"> &
  CollapsibleHeaderProps;

function CollapsibleHeaderTabView<T extends Route>(
  {
    renderTabBar,
    overflowHeight = 0,
    renderScrollHeader,
    initTabbarHeight = 44,
    minHeaderHeight = 0,
    insertTabBarElement,
    navigationState,
    insertStickyTabBarElement,
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
  const [stickyState, setStickyState] = useState<Sticky.StatusCode>(
    Sticky.STATUS_ORIGINAL
  );

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
  const onStickyStateChange = useCallback(
    ({ status }: Sticky.Status) => setStickyState(status),
    []
  );
  const _renderTabBarContainer = (children: React.ReactElement) => {
    return (
      <View style={styles.tabbarStyle}>
        <Sticky
          enabled={true}
          onStateChange={onStickyStateChange}
          top={minHeaderHeight}
        >
          {React.isValidElement(insertStickyTabBarElement) &&
            stickyState === Sticky.STATUS_FIXED &&
            insertStickyTabBarElement}
          <View onLayout={tabbarOnLayout}>{children}</View>

          {React.isValidElement(insertTabBarElement) && insertTabBarElement}
        </Sticky>
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
      }}
    >
      <View ref={containeRef} style={styles.container}>
        {renderScrollHeader && renderScrollHeader()}
        {renderTabView({
          renderTabBarContainer: _renderTabBarContainer,
        })}
      </View>
    </HeaderTabContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbarStyle: {
    zIndex: 1,
  },
});
