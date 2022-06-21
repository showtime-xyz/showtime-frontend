import { useCallback } from "react";
import { StatusBar } from "react-native";

import {
  SceneRendererProps,
  NavigationState,
} from "react-native-tab-view-next";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";

import { Haptics } from "app/lib/haptics";

import { ScollableAutoWidthTabBar } from "./scrollable-auto-width-tab-bar";
import { ScollableTabBar } from "./scrollable-tab-bar";
import { HeaderTabViewProps } from "./src/create-header-tabs";
import { HeaderTabViewComponent } from "./src/index";
import { Route } from "./src/types";

export * from "./tab-scene";
export * from "react-native-tab-view-next";

type TabBarProps<T extends Route> = HeaderTabViewProps<T> & {
  autoWidthTabBar?: boolean;
};
const StatusBarHeight = StatusBar.currentHeight ?? 0;

export function HeaderTabView<T extends Route>({
  autoWidthTabBar,
  ...props
}: TabBarProps<T>) {
  const insets = useSafeAreaInsets();
  const isDark = useIsDarkMode();
  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
      }
    ) =>
      autoWidthTabBar ? (
        <ScollableAutoWidthTabBar {...props} />
      ) : (
        <ScollableTabBar {...props} />
      ),
    [autoWidthTabBar]
  );
  const onPullEnough = useCallback(() => {
    Haptics.impactAsync();
  }, []);

  return (
    // @ts-ignore
    <HeaderTabViewComponent
      renderTabBar={renderTabBar as any}
      lazy={true as any}
      onPullEnough={onPullEnough}
      minHeaderHeight={insets.top + StatusBarHeight}
      refreshControlColor={isDark ? colors.gray[400] : colors.gray[700]}
      refreshHeight={60}
      {...props}
    />
  );
}
