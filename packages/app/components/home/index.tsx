import { useCallback } from "react";
import { useWindowDimensions, Dimensions, Platform } from "react-native";

import {
  InfiniteScrollList,
  ListRenderItemInfo,
} from "@showtime-xyz/universal.infinite-scroll-list";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useFeed } from "app/hooks/use-feed";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

import { EmptyPlaceholder } from "../empty-placeholder";
import { ListHeaderComponent } from "./header";
import { HomeItem, HomeItemSketelon } from "./home-item";
import { PopularCreators } from "./popular-creators";

const windowHeight = Dimensions.get("window").height;

export const Home = () => {
  const bottom = usePlatformBottomHeight();
  const headerHeight = useHeaderHeight();
  const { width, height } = useWindowDimensions();
  const bottomBarHeight = usePlatformBottomHeight();
  const isMdWidth = width >= breakpoints["md"];
  const { data, isLoading } = useFeed();
  const mediaSize = isMdWidth ? 500 : width - 48 - 56;
  const keyExtractor = useCallback((item: any, index: any) => `${index}`, []);
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<NFT>) => {
      if (index === 0) {
        return (
          <>
            <HomeItem nft={item} mediaSize={mediaSize} index={index} />
            <PopularCreators />
          </>
        );
      }
      return <HomeItem nft={item} mediaSize={mediaSize} index={index} />;
    },
    [mediaSize]
  );

  const ListFooterComponent = useCallback(() => {
    return (
      <View
        style={{ height: Math.max(bottom, 30) }}
        tw="items-center justify-center"
      >
        <Text tw="text-sm text-gray-600 dark:text-gray-400">No more data.</Text>
      </View>
    );
  }, [bottom]);
  const ListEmptyComponent = useCallback(() => {
    return (
      <View tw="mt-6 px-4 md:px-0" style={{ height: height - 200 }}>
        {isLoading ? (
          <>
            <HomeItemSketelon />
            <HomeItemSketelon />
          </>
        ) : (
          <EmptyPlaceholder
            title={"No drops, yet."}
            tw="h-[50vh] pt-32"
            hideLoginBtn
          />
        )}
      </View>
    );
  }, [height, isLoading]);
  return (
    <View tw="w-full flex-1 items-center bg-white dark:bg-black">
      <View tw="md:max-w-screen-content w-full">
        <InfiniteScrollList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={600}
          overscan={8}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          contentContainerStyle={{
            paddingTop: Platform.select({
              android: 0,
              default: headerHeight,
            }),
          }}
          ListEmptyComponent={ListEmptyComponent}
          useWindowScroll={isMdWidth}
          style={{
            height: Platform.select({
              default: windowHeight - bottomBarHeight,
              web: isMdWidth ? undefined : windowHeight - bottomBarHeight,
              ios: windowHeight,
            }),
          }}
        />
      </View>
    </View>
  );
};
