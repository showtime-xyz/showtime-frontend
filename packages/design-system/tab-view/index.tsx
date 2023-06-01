import { useCallback, memo } from "react";
import { Platform, StatusBar, StyleProp, ViewStyle } from "react-native";

import { SceneRendererProps, NavigationState } from "react-native-tab-view";

import {
  CollapsibleTabView,
  CollapsibleTabViewProps,
} from "@showtime-xyz/universal.collapsible-tab-view";
import type { Route } from "@showtime-xyz/universal.collapsible-tab-view";
import { TabScrollView } from "@showtime-xyz/universal.collapsible-tab-view";
import { Haptics } from "@showtime-xyz/universal.haptics";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { RefreshControl } from "./refresh-control";
import { ScollableAutoWidthTabBar } from "./scrollable-auto-width-tab-bar";
import { ScollableTabBar } from "./scrollable-tab-bar";

export * from "@showtime-xyz/universal.collapsible-tab-view";
export * from "./tab-flash-list";
export * from "react-native-tab-view";
export * from "./tab-flash-list-scroll-view";
export * from "./tab-bar-single";
export * from "./scrollable-auto-width-tab-bar";
export * from "./scrollable-tab-bar";
export * from "./tab-bar-vertical";
export { ScollableAutoWidthTabBar } from "./scrollable-auto-width-tab-bar";
export { ScollableTabBar } from "./scrollable-tab-bar";

type TabBarProps<T extends Route> = CollapsibleTabViewProps<T> & {
  autoWidthTabBar?: boolean;
  hideTabBar?: boolean;
};
export const StatusBarHeight = StatusBar.currentHeight ?? 0;

function HeaderTabView<T extends Route>({
  autoWidthTabBar,
  renderScene,
  navigationState,
  hideTabBar = false,
  renderTabBar: renderTabBarProps,
  ...props
}: TabBarProps<T>) {
  const insets = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<T>;
      }
    ) => {
      if (
        hideTabBar ||
        !props.navigationState?.routes ||
        props.navigationState?.routes?.length === 0
      ) {
        return null;
      }
      if (renderTabBarProps) {
        return renderTabBarProps(props);
      }
      return (
        <>
          {autoWidthTabBar ? (
            <ScollableAutoWidthTabBar {...props} />
          ) : (
            <ScollableTabBar {...props} />
          )}
        </>
      );
    },
    [autoWidthTabBar, hideTabBar, renderTabBarProps]
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
    <CollapsibleTabView
      renderTabBar={renderTabBar}
      lazy
      onPullEnough={onPullEnough}
      minHeaderHeight={insets.top + StatusBarHeight}
      refreshControlColor={isDark ? colors.gray[400] : colors.gray[700]}
      refreshHeight={60}
      renderScene={_renderScene}
      navigationState={navigationState}
      renderRefreshControl={RefreshControl}
      {...props}
    />
  );
}

type TabLoadingProps = {
  index: number;
  style?: StyleProp<ViewStyle>;
};

export const TabSpinner = memo<TabLoadingProps>(function TabSpinner({
  index,
  style,
}) {
  return (
    <TabScrollView style={style} index={index}>
      <View tw="h-60 items-center justify-center">
        <Spinner size="small" />
      </View>
    </TabScrollView>
  );
});
export { Route, HeaderTabView };
