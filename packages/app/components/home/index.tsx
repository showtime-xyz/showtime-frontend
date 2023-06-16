import { useCallback, useMemo } from "react";
import { useWindowDimensions, Dimensions, Platform } from "react-native";

import {
  InfiniteScrollList,
  ListRenderItemInfo,
} from "@showtime-xyz/universal.infinite-scroll-list";
import { View } from "@showtime-xyz/universal.view";

import { useFeed } from "app/hooks/use-feed";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

import { ListHeaderComponent } from "./header";
import { HomeItem } from "./home-item";
import { PopularCreators } from "./popular-creators";

const windowHeight = Dimensions.get("window").height;

export const Home = () => {
  const bottom = usePlatformBottomHeight();
  const headerHeight = useHeaderHeight();
  const { width } = useWindowDimensions();
  const bottomBarHeight = usePlatformBottomHeight();
  const isMdWidth = width >= breakpoints["md"];
  const { data } = useFeed();
  const mediaSize = isMdWidth ? 300 : width - 48 - 56;
  const keyExtractor = useCallback((item: any, index: any) => `${index}`, []);
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<NFT>) => {
      if (index === 0) {
        return (
          <View>
            <HomeItem nft={item} mediaSize={mediaSize} index={index} />
            <PopularCreators />
          </View>
        );
      }
      return <HomeItem nft={item} mediaSize={mediaSize} index={index} />;
    },
    [mediaSize]
  );
  return (
    <View tw="w-full flex-1 items-center bg-white dark:bg-black md:pt-8">
      <View tw="max-w-screen-content w-full">
        <InfiniteScrollList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={600}
          overscan={8}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={{
            paddingBottom: bottom,
            paddingTop: Platform.select({
              android: 0,
              default: headerHeight,
            }),
          }}
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
