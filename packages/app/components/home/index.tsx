import { useState, useRef, useCallback } from "react";
import { useWindowDimensions, Dimensions } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Image } from "@showtime-xyz/universal.image";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { DESKTOP_CONTENT_WIDTH } from "app/constants/layout";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { Carousel } from "app/lib/carousel";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { breakpoints } from "design-system/theme";

const windowWidth = Dimensions.get("window").width;

export const Home = () => {
  const [data, setData] = useState([...new Array(4).keys()]);
  const [isVertical, setIsVertical] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const bottom = usePlatformBottomHeight();
  const headerHeight = useHeaderHeight();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];

  const pagerWidth = isMdWidth ? DESKTOP_CONTENT_WIDTH : windowWidth;

  const ListHeaderComponent = useCallback(() => {
    return (
      <View tw="w-full px-4 md:px-0">
        <Carousel
          loop
          width={pagerWidth}
          height={164}
          autoPlay={isAutoPlay}
          autoPlayInterval={3000}
          data={data}
          controller
          tw="mb-8 w-full rounded-2xl"
          pagination={{ variant: "rectangle" }}
          renderItem={({ index }) => (
            <View
              key={index}
              tw="h-full"
              style={{
                backgroundColor: `#${index + 2}7${index + 4}0E1`,
                width: pagerWidth,
              }}
            />
          )}
        />
      </View>
    );
  }, [data, isAutoPlay, pagerWidth]);
  const keyExtractor = useCallback((item: any, index: any) => `${index}`, []);
  const renderItem = () => {
    return <View tw="mb-4 h-40 bg-gray-500"></View>;
  };
  return (
    <View tw="w-full flex-1 items-center bg-white dark:bg-black md:pt-8">
      <View tw="flex-1" style={{ width: pagerWidth }}>
        <InfiniteScrollList
          data={new Array(20).fill(0)}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={64}
          overscan={8}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={{
            paddingBottom: bottom,
            paddingTop: headerHeight,
          }}
        />

        <View tw="mt-8">
          <Text tw="text-lg text-black dark:text-white">Home V2</Text>
        </View>
      </View>
    </View>
  );
};
