import { useCallback, useState } from "react";
import { Platform } from "react-native";

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
import { TRENDING_ROUTE, TabListContainer, TrendingTabListRef } from "./tabs";

export const Trending = () => {
  const headerHeight = useHeaderHeight();
  const contentWidth = useContentWidth();
  const { index, setIndex, routes, tabRefs } =
    useTabState<TrendingTabListRef>(TRENDING_ROUTE);

  const renderScene = useCallback(
    ({
      route: { index: sceneIndex },
    }: SceneRendererProps & {
      route: Route;
    }) => {
      console.log(TRENDING_ROUTE[index].key);

      return (
        <TabListContainer
          days={+TRENDING_ROUTE[index].key}
          index={sceneIndex}
          ref={(ref) => (tabRefs.current[sceneIndex] = ref)}
        />
      );
    },
    [index, tabRefs]
  );
  const [selecteds] = useState({
    ...TRENDING_ROUTE.map(() => 0),
  });

  // const renderSceneHeader = useCallback(
  //   (props: Route) => {
  //     return (
  //       <View tw="bg-white p-4 dark:bg-black">
  //         <SegmentedControl
  //           values={["DROP", "CREATOR"]}
  //           onChange={(newIndex) => {
  //             Haptics.impactAsync();
  //             setSelecteds({
  //               ...selecteds,
  //               [props.index]: newIndex,
  //             });
  //           }}
  //           selectedIndex={selecteds[props.index]}
  //         />
  //       </View>
  //     );
  //   },
  //   [selecteds]
  // );
  const renderHeader = useCallback(() => {
    return (
      <>
        {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}
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
        <HeaderTabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderScrollHeader={renderHeader}
          minHeaderHeight={Platform.select({
            default: headerHeight,
            android: 0,
          })}
          refreshControlTop={Platform.select({
            ios: headerHeight,
            default: 0,
          })}
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
