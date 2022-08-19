import { useCallback, isValidElement } from "react";
import { Platform, StatusBar, View } from "react-native";

import {
  SceneRendererProps,
  NavigationState,
} from "react-native-tab-view-next";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";

import { Route } from "design-system/tab-view-core";
import { HeaderTabView as HeaderTabViewCore } from "design-system/tab-view-core";
import { HeaderTabViewProps } from "design-system/tab-view-core";

import { Haptics } from "./haptics";
import { ScollableAutoWidthTabBar } from "./scrollable-auto-width-tab-bar";
import { ScollableTabBar } from "./scrollable-tab-bar";
import { TabSpinner } from "./tab-spinner";

export * from "design-system/tab-view-core";
export * from "./tab-flash-list-scroll-view";
export * from "react-native-tab-view-next";

type TabBarProps<T extends Route> = HeaderTabViewProps<T> & {
  autoWidthTabBar?: boolean;
  insertTabBarElement?: JSX.Element;
  hideTabBar?: boolean;
};
const StatusBarHeight = StatusBar.currentHeight ?? 0;

function HeaderTabView<T extends Route>({
  autoWidthTabBar,
  renderScene,
  navigationState,
  insertTabBarElement,
  hideTabBar = false,
  ...props
}: TabBarProps<T>) {
  const insets = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
      }
    ) => {
      if (hideTabBar) return null;
      return (
        <>
          {autoWidthTabBar ? (
            <ScollableAutoWidthTabBar {...props} />
          ) : (
            <ScollableTabBar {...props} />
          )}
          {isValidElement(insertTabBarElement) && insertTabBarElement}
        </>
      );
    },
    [autoWidthTabBar, hideTabBar, insertTabBarElement]
  );
  const onPullEnough = useCallback(() => {
    Haptics.impactAsync();
  }, []);
  const _renderScene = (
    props: SceneRendererProps & {
      route: Route;
    }
  ) => {
    const focused =
      navigationState.index === props.route?.index || Platform.OS !== "web";
    return (
      <>
        <View style={{ flex: 1, display: focused ? "flex" : "none" }}>
          {renderScene(props as any)}
        </View>
        {Platform.OS === "web" && (
          <TabSpinner
            index={props.route?.index}
            style={{ display: focused ? "none" : "flex" }}
          />
        )}
      </>
    );
  };
  return (
    <HeaderTabViewCore
      renderTabBar={renderTabBar}
      lazy
      onPullEnough={onPullEnough}
      minHeaderHeight={insets.top + StatusBarHeight}
      refreshControlColor={isDark ? colors.gray[400] : colors.gray[700]}
      refreshHeight={60}
      renderScene={_renderScene}
      navigationState={navigationState}
      {...props}
    />
  );
}
export { Route, HeaderTabView };
