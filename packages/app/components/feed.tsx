import React, { Suspense } from "react";
import { Dimensions, StatusBar } from "react-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SwipeList } from "app/components/swipe-list";
import { useFeed } from "app/hooks/use-feed";
import { useUser } from "app/hooks/use-user";

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
  const queryState = useFeed();
  const bottomBarHeight = useBottomTabBarHeight();
  const { isAuthenticated } = useUser();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <SwipeList
      {...queryState}
      bottomPadding={isAuthenticated ? bottomBarHeight : safeAreaBottom}
      data={queryState.data}
    />
  );
};
