import { ScrollView, Dimensions } from "react-native";

import { useSafeAreaFrame } from "react-native-safe-area-context";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

const items = new Array(100).fill(0).map((_, i) => i);
export const VideoFeed = () => {
  const size = useSafeAreaFrame();
  return (
    <View tw="w-scree h-screen">
      {/* <InfiniteScrollList
        useWindowScroll={false}
        // pagingEnabled
        data={[1, 2, 3, 4, 5, 6, 7, 8]}
        estimatedItemSize={100}
        // snapToOffsets={[50, 400, 800]}
        pagingEnabled
        snapToStart
        renderItem={({ index }) =>
          index === 0 ? (
            <View tw="bg-red-400 pt-10" />
          ) : (
            <View tw="h-screen w-screen items-center justify-center border-2 bg-white">
              <Text>Hello</Text>
            </View>
          )
        }
      /> */}
      <ScrollView
        snapToOffsets={[256].concat(items.map((_, i) => i * size.height + 256))}
        decelerationRate="fast"
      >
        <View tw="h-[256px] w-full border-2 bg-red-400" />
        {items.map((_, i) => (
          <View
            key={i}
            tw="w-screen items-center justify-center border-2 bg-white"
            style={{
              height: size.height,
            }}
          >
            <Text>Hello</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
