import { useCallback } from "react";
import { Platform } from "react-native";

import { SceneRendererProps } from "react-native-tab-view-next/src";

import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useContentWidth } from "app/hooks/use-content-width";
import { useTabState } from "app/hooks/use-tab-state";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { HeaderTabView } from "design-system/tab-view/index";
import { Route } from "design-system/tab-view/src/types";

import { TabListContainer, TrendingTabListRef } from "./tab-list";

export const Trending = () => {
  const headerHeight = useHeaderHeight();
  const contentWidth = useContentWidth();
  const {
    index,
    setIndex,
    setIsRefreshing,
    isRefreshing,
    routes,
    setTabRefs,
    currentTab,
  } = useTabState<TrendingTabListRef>([
    {
      title: "Today",
      key: "Today",
      index: 0,
    },
    {
      title: "This Week",
      key: "Week",
      index: 1,
    },
    {
      title: "This Month",
      key: "Month",
      index: 2,
    },
  ]);

  const onStartRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Todo: use async/await.
    currentTab?.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, [currentTab, setIsRefreshing]);

  const renderScene = useCallback(
    ({
      route: { index },
    }: SceneRendererProps & {
      route: Route;
    }) => {
      return <TabListContainer days={1} index={index} ref={setTabRefs} />;
    },
    [setTabRefs]
  );
  const renderHeader = useCallback(() => {
    return (
      <>
        {Platform.OS === "ios" && <View tw={`h-[${headerHeight}px]`} />}
        <View tw="flex-row justify-between bg-white py-2 px-4 dark:bg-black">
          <Text tw="font-space-bold text-2xl font-extrabold text-gray-900 dark:text-white">
            Trending
          </Text>
        </View>
      </>
    );
  }, [headerHeight]);
  return (
    <View tw="flex-1 bg-white dark:bg-black">
      <HeaderTabView
        onStartRefresh={onStartRefresh}
        isRefreshing={isRefreshing}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderScrollHeader={renderHeader}
        minHeaderHeight={Platform.select({
          ios: headerHeight,
          default: 0,
        })}
        refreshControlTop={Platform.select({
          ios: headerHeight,
          default: 0,
        })}
        initialLayout={{
          width: contentWidth,
        }}
        style={tw.style("z-1")}
      />
    </View>
  );
};
