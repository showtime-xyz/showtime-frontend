import { ReactElement, useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Spinner,
  Text,
  Tabs,
  TabItem,
  SelectedTabIndicator,
  CreatorPreview,
  SegmentedControl,
} from "design-system";
import { tw } from "design-system/tailwind";
import { useTrendingCreators, useTrendingNFTS } from "../hooks/api-hooks";
import { useScrollToTop } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Dimensions, Platform } from "react-native";
import { Video } from "expo-av";
import { Image } from "design-system/image";
import { memo } from "react";
import { NFT } from "app/types";

const TAB_LIST_HEIGHT = 64;

const Footer = ({ isLoading }: { isLoading: boolean }) => {
  const tabBarHeight = useBottomTabBarHeight();

  if (isLoading) {
    return (
      <View
        tw="h-16 items-center justify-center mt-6 px-3"
        sx={{ marginBottom: tabBarHeight }}
      >
        <Spinner size="small" />
      </View>
    );
  }

  return <View sx={{ marginBottom: tabBarHeight }}></View>;
};

export const Trending = () => {
  const [selected, setSelected] = useState(0);

  return (
    <View tw="bg-white dark:bg-black flex-1">
      <Tabs.Root onIndexChange={setSelected} initialIndex={selected} lazy>
        <Tabs.Header>
          <View tw="bg-white dark:bg-black pt-4 pl-4 pb-[3px]">
            <Text tw="text-gray-900 dark:text-white font-bold text-3xl">
              Trending
            </Text>
          </View>
        </Tabs.Header>
        <Tabs.List
          style={useMemo(
            () => ({
              height: TAB_LIST_HEIGHT,
              ...tw.style(
                "dark:bg-black bg-white border-b border-b-gray-100 dark:border-b-gray-900"
              ),
            }),
            []
          )}
        >
          <Tabs.Trigger>
            <TabItem name="24 hours" selected={selected === 0} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="7 days" selected={selected === 1} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="30 days" selected={selected === 2} />
          </Tabs.Trigger>

          <SelectedTabIndicator />
        </Tabs.List>
        <Tabs.Pager>
          <TabListContainer days={1} />
          <TabListContainer days={7} />
          <TabListContainer days={30} />
        </Tabs.Pager>
      </Tabs.Root>
    </View>
  );
};

const TabListContainer = ({ days }: { days: number }) => {
  const [selected, setSelected] = useState(0);

  const SelectionControl = useMemo(
    () => (
      <View tw="p-4">
        <SegmentedControl
          values={["CREATORS", "NFTS"]}
          onChange={setSelected}
          selectedIndex={selected}
        />
      </View>
    ),
    [selected, setSelected]
  );

  if (selected === 0) {
    return <CreatorsList days={days} ListHeaderComponent={SelectionControl} />;
  } else {
    return <NFTSList days={days} ListHeaderComponent={SelectionControl} />;
  }
};

const CreatorsList = ({
  days,
  ListHeaderComponent,
}: {
  days: number;
  ListHeaderComponent: ReactElement;
}) => {
  const {
    data,
    isLoadingMore,
    isLoading,
    status,
    isRefreshing,
    refresh,
    fetchMore,
  } = useTrendingCreators({
    days,
  });

  const keyExtractor = useCallback((_item, index) => {
    return index.toString();
  }, []);

  const renderItem = useCallback(({ item }) => {
    return <CreatorPreview creator={item} />;
  }, []);

  const listRef = useRef(null);

  useScrollToTop(listRef);

  const ListFooterComponent = useCallback(
    () => <Footer isLoading={isLoadingMore} />,
    [isLoadingMore]
  );

  return (
    <View tw="flex-1">
      <Tabs.FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshing={isRefreshing}
        onRefresh={refresh}
        onEndReached={fetchMore}
        ref={listRef}
        onEndReachedThreshold={0.6}
        removeClippedSubviews={Platform.OS !== "web"}
        ListHeaderComponent={ListHeaderComponent}
        numColumns={1}
        windowSize={4}
        initialNumToRender={10}
        alwaysBounceVertical={false}
        ListFooterComponent={ListFooterComponent}
      />
      {data.length === 0 && status === "success" ? (
        <View tw="items-center justify-center">
          <Text tw="text-gray-900 dark:text-white">No results found</Text>
        </View>
      ) : isLoading ? (
        <View tw="items-center justify-center">
          <Spinner />
        </View>
      ) : null}
    </View>
  );
};

const GAP_BETWEEN_ITEMS = 1;
const ITEM_SIZE = Dimensions.get("window").width / 2;

const NFTSList = ({
  days,
  ListHeaderComponent,
}: {
  days: number;
  ListHeaderComponent: ReactElement;
}) => {
  const {
    data,
    isLoadingMore,
    isLoading,
    status,
    isRefreshing,
    refresh,
    fetchMore,
  } = useTrendingNFTS({
    days,
  });

  const keyExtractor = useCallback((_item, index) => {
    return index.toString();
  }, []);

  const renderItem = useCallback(({ item }) => <Media item={item} />, []);

  const listRef = useRef(null);

  useScrollToTop(listRef);

  const ListFooterComponent = useCallback(
    () => <Footer isLoading={isLoadingMore} />,
    [isLoadingMore]
  );

  const getItemLayout = useCallback((_data, index) => {
    return { length: ITEM_SIZE, offset: ITEM_SIZE * index, index };
  }, []);

  return (
    <View tw="flex-1">
      <Tabs.FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshing={isRefreshing}
        onRefresh={refresh}
        onEndReached={fetchMore}
        ref={listRef}
        onEndReachedThreshold={0.6}
        removeClippedSubviews={Platform.OS !== "web"}
        ListHeaderComponent={ListHeaderComponent}
        numColumns={2}
        getItemLayout={getItemLayout}
        windowSize={4}
        initialNumToRender={10}
        alwaysBounceVertical={false}
        ListFooterComponent={ListFooterComponent}
        style={useMemo(() => ({ margin: -GAP_BETWEEN_ITEMS }), [])}
      />
      {data.length === 0 && status === "success" ? (
        <View tw="items-center justify-center">
          <Text tw="text-gray-900 dark:text-white">No results found</Text>
        </View>
      ) : isLoading ? (
        <View tw="items-center justify-center">
          <Spinner />
        </View>
      ) : null}
    </View>
  );
};

const Media = memo(({ item }: { item: NFT }) => {
  const style = useMemo(() => {
    return {
      width: ITEM_SIZE - GAP_BETWEEN_ITEMS,
      height: ITEM_SIZE - GAP_BETWEEN_ITEMS,
      margin: GAP_BETWEEN_ITEMS,
    };
  }, [item]);

  if (item.mime_type?.startsWith("video")) {
    return (
      <Video
        source={{
          uri: item.animation_preview_url,
        }}
        style={style}
        useNativeControls
        isLooping
        isMuted
      />
    );
  } else if (item.mime_type?.startsWith("image")) {
    return (
      <Image
        source={{
          uri: item.still_preview_url,
        }}
        style={style}
      />
    );
  }

  return null;
});
