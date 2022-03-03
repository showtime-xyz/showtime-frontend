import React, { Suspense, useMemo } from "react";
import { Dimensions, StatusBar } from "react-native";

import { View, Skeleton } from "design-system";
import { useColorScheme } from "design-system/hooks";

import { useActivity } from "../hooks/api-hooks";
import { SwipeList } from "./swipe-list";

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

  const newData: any = useMemo(() => {
    if (queryState.data && Array.isArray(queryState.data)) {
      return queryState.data.filter((d) => d.nfts[0]);
    }
    return [];
  }, [queryState.data]);

  return <SwipeList {...queryState} data={newData} />;
};
