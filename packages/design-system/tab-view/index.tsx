import { useCallback, forwardRef } from "react";
import { StatusBar } from "react-native";

import { SceneRendererProps, NavigationState } from "react-native-tab-view/src";

import { colors } from "@showtime-xyz/universal.tailwind";

import { Haptics } from "app/lib/haptics";
import { useSafeAreaInsets } from "app/lib/safe-area/index";

import { useIsDarkMode } from "../hooks";
import { ScollableTabBar } from "./scrollable-tab-bar";
import { HeaderTabViewProps } from "./src/create-header-tabs";
import { HeaderTabViewComponent } from "./src/index";
import { Route } from "./src/types";

export * from "./tab-scene";

type TabBarProps<T extends Route> = HeaderTabViewProps<T>;
const StatusBarHeight = StatusBar.currentHeight ?? 0;

export const HeaderTabView = forwardRef(CommonHeaderTabView);

function CommonHeaderTabView<T extends Route>(props: TabBarProps<T>, ref: any) {
  const insets = useSafeAreaInsets();
  const isDark = useIsDarkMode();
  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
      }
    ) => <ScollableTabBar {...props} />,
    []
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
      ref={ref}
      {...props}
    />
  );
}
