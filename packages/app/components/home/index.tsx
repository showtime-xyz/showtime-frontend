import { useCallback, useRef } from "react";
import { useWindowDimensions, Dimensions, Platform } from "react-native";

import {
  InfiniteScrollList,
  ListRenderItemInfo,
} from "@showtime-xyz/universal.infinite-scroll-list";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { useFeed } from "app/hooks/use-feed";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

import { EmptyPlaceholder } from "../empty-placeholder";
import {
  ListHeaderComponent,
  ListHeaderComponentOnChainSummer,
} from "./header";
import { HomeItem, HomeItemSketelon } from "./home-item";
import { PopularCreators } from "./popular-creators";

const windowHeight = Dimensions.get("window").height;

export const Home = () => {
  const bottomBarHeight = usePlatformBottomHeight();
  const headerHeight = useHeaderHeight();
  const { width, height } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const { data, isLoading } = useFeed();
  const listRef = useRef<any>();
  useScrollToTop(listRef);

  const mediaSize = isMdWidth ? 500 : width - 48 - 56;
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

  const ListEmptyComponent = useCallback(() => {
    return (
      <View tw="mt-6 px-4 md:px-0" style={{ height: height - 200 }}>
        {isLoading ? (
          <>
            <HomeItemSketelon mediaSize={mediaSize} />
            <HomeItemSketelon mediaSize={mediaSize} />
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
  }, [height, isLoading, mediaSize]);
  const getItemType = useCallback((_: NFT, index: number) => {
    if (index === 0) {
      return "popularCreators";
    }
    return "homeItem";
  }, []);
  return (
    <View
      tw="w-full flex-1 items-center bg-white dark:bg-black"
      style={{
        marginBottom: Platform.select({
          native: bottomBarHeight,
        }),
      }}
    >
      <View tw="md:max-w-screen-content w-full">
        <ErrorBoundary>
          <InfiniteScrollList
            data={data}
            renderItem={renderItem}
            estimatedItemSize={600}
            drawDistance={Platform.OS === "android" ? height : undefined}
            preserveScrollPosition
            ListHeaderComponent={ListHeaderComponentOnChainSummer}
            contentContainerStyle={{
              paddingTop: Platform.select({
                android: 0,
                default: headerHeight,
              }),
            }}
            automaticallyAdjustContentInsets
            automaticallyAdjustsScrollIndicatorInsets
            ref={listRef}
            getItemType={getItemType}
            ListEmptyComponent={ListEmptyComponent}
            useWindowScroll
            style={{ flexGrow: 1 }}
          />
        </ErrorBoundary>
      </View>
    </View>
  );
};
