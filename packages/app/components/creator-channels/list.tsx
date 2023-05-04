import { useCallback, memo, useRef } from "react";
import { Platform, RefreshControl, useWindowDimensions } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
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

const CreatorChannelsHeader = memo(() => {
  const headerHeight = useHeaderHeight();

  return (
    <View tw="px-4 py-4">
      <Text tw="text-2xl font-extrabold text-gray-900 dark:text-white">
        Channels
      </Text>
      <View tw="mt-3">
        <Text tw="text-sm leading-5 text-gray-500">
          Get exclusive updates, presale access and unreleased content from your
          favorite creators.
        </Text>
      </View>
    </View>
  );
});

CreatorChannelsHeader.displayName = "CreatorChannelsHeader";

const CreatorChannelsListItem = memo(
  ({ item }: { item: CreatorChannelsListItemProps }) => {
    return (
      <View tw="px-4 py-2">
        <AvatarHoverCard
          username={item.username}
          url={"https://picsum.photos/200?" + item.id}
          size={52}
          alt="CreatorPreview Avatar"
        />
        <Text>{item.username}</Text>
      </View>
    );
  }
);

CreatorChannelsListItem.displayName = "CreatorChannelsListItem";

export const CreatorChannelsList = memo(
  ({ web_height = undefined }: { web_height?: number }) => {
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
        ListHeaderComponent={CreatorChannelsHeader}
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
        estimatedItemSize={17}
      />
    );
  }
);

CreatorChannelsList.displayName = "CreatorChannelsList";
