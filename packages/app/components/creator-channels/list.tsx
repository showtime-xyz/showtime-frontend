import { useCallback, memo, useRef } from "react";
import { Platform, RefreshControl, useWindowDimensions } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { axios } from "app/lib/axios";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { generateFakeData } from "app/utilities";

import { useChannelsList } from "./hooks/use-channels-list";

type CreatorChannelsListProps = {
  item: CreatorChannelsListItemProps;
  index: number;
};

type CreatorChannelsListItemProps = {
  id: string;
  username: string;
  date: string;
  // TODO: Add more props
};

const keyExtractor = (item: CreatorChannelsListItemProps) => {
  return item.id.toString();
};

const Header = () => {
  const headerHeight = useHeaderHeight();

  return Platform.OS === "web" ? (
    <View tw="w-full flex-row justify-center px-4 py-4">
      <Text tw="text-lg font-extrabold text-gray-900 dark:text-white md:text-2xl">
        Creator Channels
      </Text>
    </View>
  ) : (
    <View style={{ height: headerHeight }} />
  );
};

const CreatorChannelsListItem = memo(
  ({ item }: { item: CreatorChannelsListItemProps }) => {
    return (
      <View>
        <Text>{item.username}</Text>
      </View>
    );
  }
);

CreatorChannelsListItem.displayName = "CreatorChannelsListItem";

export const CreatorChannelsList = memo(
  ({
    hideHeader = false,
    web_height = undefined,
  }: {
    hideHeader?: boolean;
    web_height?: number;
  }) => {
    //const { data, fetchMore, refresh, isRefreshing, isLoadingMore, isLoading } = useChannelsList();

    // Start FAKE:
    const data = generateFakeData(
      300
    ) as unknown as CreatorChannelsListItemProps[];
    const fetchMore = () => {};
    const refresh = () => {};
    const isRefreshing = false;
    const isLoadingMore = false;
    const isLoading = false;
    // End FAKE

    const renderItem = useCallback(({ item }: CreatorChannelsListProps) => {
      return <CreatorChannelsListItem item={item} />;
    }, []);
    const isDark = useIsDarkMode();
    const bottomBarHeight = usePlatformBottomHeight();
    const headerHeight = useHeaderHeight();
    const { height: windowHeight } = useWindowDimensions();

    const listRef = useRef<any>();
    useScrollToTop(listRef);

    const ListFooterComponent = useCallback(() => {
      if (isLoadingMore)
        return (
          <View tw="items-center pb-4">
            <Spinner size="small" />
          </View>
        );
      return null;
    }, [isLoadingMore]);

    return (
      <InfiniteScrollList
        useWindowScroll={false}
        data={data}
        ListHeaderComponent={Platform.select({
          web: hideHeader ? undefined : Header,
          default: undefined,
        })}
        // for blur header effect on iOS
        style={{
          height: Platform.select({
            default: windowHeight - bottomBarHeight,
            web: web_height ? web_height : windowHeight - bottomBarHeight,
            ios: windowHeight,
          }),
        }}
        // for blur effect on Native
        contentContainerStyle={Platform.select({
          ios: {
            paddingTop: headerHeight,
            paddingBottom: bottomBarHeight,
          },
          android: {
            paddingBottom: bottomBarHeight,
          },
          default: {},
        })}
        // Todo: unity refresh control same as tab view
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            progressViewOffset={headerHeight}
            tintColor={isDark ? colors.gray[200] : colors.gray[700]}
            colors={[colors.violet[500]]}
            progressBackgroundColor={
              isDark ? colors.gray[200] : colors.gray[100]
            }
          />
        }
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={fetchMore}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListFooterComponent={ListFooterComponent}
        ref={listRef}
        estimatedItemSize={56}
      />
    );
  }
);

CreatorChannelsList.displayName = "CreatorChannelsList";
