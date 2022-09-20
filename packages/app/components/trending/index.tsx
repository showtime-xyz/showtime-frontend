import { useCallback, useState } from "react";
import { Platform } from "react-native";

import { Haptics } from "@showtime-xyz/universal.haptics";
import { SegmentedControl } from "@showtime-xyz/universal.segmented-control";
import {
  SceneRendererProps,
  HeaderTabView,
  Route,
} from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useContentWidth } from "app/hooks/use-content-width";
import { useTabState } from "app/hooks/use-tab-state";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { TrendingContext } from "./context";
import { TabListContainer, TrendingTabListRef } from "./tab-list";

type TrendingTabRoute = Route & {
  days: number;
};
export const TRENDING_ROUTE = [
  {
    title: "Today",
    key: "Today",
    index: 0,
    days: 1,
  },
  {
    title: "This week",
    key: "Week",
    index: 1,
    days: 7,
  },
  {
    title: "This month",
    key: "Month",
    index: 2,
    days: 30,
  },
];
export const Trending = () => {
  const headerHeight = useHeaderHeight();
  const contentWidth = useContentWidth();
  const {
    index,
    setIndex,
    setIsRefreshing,
    isRefreshing,
    routes,
    tabRefs,
    currentTab,
  } = useTabState<TrendingTabListRef, TrendingTabRoute>(TRENDING_ROUTE);

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
      route: { index, days },
    }: SceneRendererProps & {
      route: TrendingTabRoute;
    }) => {
      return (
        <TabListContainer
          days={days}
          index={index}
          ref={(ref) => (tabRefs.current[index] = ref)}
        />
      );
    },
    [tabRefs]
  );
  const [selecteds, setSelecteds] = useState({
    ...TRENDING_ROUTE.map(() => 0),
  });

  const renderSceneHeader = useCallback(
    (props: TrendingTabRoute) => {
      return (
        <View tw="bg-white p-4 dark:bg-black">
          <SegmentedControl
            values={["NFT", "CREATOR"]}
            onChange={(newIndex) => {
              Haptics.impactAsync();
              setSelecteds({
                ...selecteds,
                [props.index]: newIndex,
              });
            }}
            selectedIndex={selecteds[props.index]}
          />
        </View>
      );
    },
    [selecteds]
  );
  const renderHeader = useCallback(() => {
    return (
      <>
        {Platform.OS !== "web" && <View style={{ height: headerHeight }} />}
        <View tw="flex-row justify-between bg-white py-2 px-4 dark:bg-black">
          <Text tw="font-space-bold text-2xl font-extrabold text-gray-900 dark:text-white">
            Trending
          </Text>
        </View>
      </>
    );
  }, [headerHeight]);

  return (
    <TrendingContext.Provider value={selecteds}>
      <View style={{ width: contentWidth }} tw="flex-1">
        <HeaderTabView<TrendingTabRoute>
          onStartRefresh={onStartRefresh}
          isRefreshing={isRefreshing}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderScrollHeader={renderHeader}
          minHeaderHeight={headerHeight}
          refreshControlTop={headerHeight}
          initialLayout={{
            width: contentWidth,
          }}
          style={{ zIndex: 1 }}
          // renderSceneHeader={renderSceneHeader}
        />
      </View>
    </TrendingContext.Provider>
  );
};
