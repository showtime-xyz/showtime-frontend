import React, { Suspense, useMemo } from "react";
import { Dimensions, StatusBar } from "react-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { SwipeList } from "app/components/swipe-list";
import { useActivity } from "app/hooks/api-hooks";

import { View, Skeleton } from "design-system";
import { useColorScheme } from "design-system/hooks";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

export const Feed = () => {
  const colorScheme = useColorScheme();
  return (
    <>
      <StatusBar barStyle="light-content" />
      <View tw="flex-1" testID="homeFeed">
        <Suspense
          fallback={
            <View tw="items-center">
              <Skeleton
                colorMode={colorScheme}
                height={screenHeight - 300}
                width={screenWidth}
              />
              <View tw="h-2" />
              <Skeleton
                colorMode={colorScheme}
                height={300}
                width={screenWidth}
              />
            </View>
          }
        >
          <FeedList />
        </Suspense>
      </View>
    </>
  );
};

export const FeedList = () => {
  const queryState = useActivity({ typeId: 0 });
  const bottomBarHeight = useBottomTabBarHeight();

  const newData: any = useMemo(() => {
    if (queryState.data && Array.isArray(queryState.data)) {
      return queryState.data.filter((d) => d.nfts[0]).map((d) => d.nfts[0]);
    }
    return [];
  }, [queryState.data]);

  return (
    <SwipeList {...queryState} bottomPadding={bottomBarHeight} data={newData} />
  );
};
