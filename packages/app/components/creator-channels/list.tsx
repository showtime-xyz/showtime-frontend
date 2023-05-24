import { useCallback, memo, useRef, useMemo } from "react";
import { Platform, RefreshControl, useWindowDimensions } from "react-native";

import { RectButton } from "react-native-gesture-handler";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { formatDateRelativeWithIntl } from "app/utilities";

import {
  useJoinedChannelsList,
  useOwnedChannelsList,
  useSuggestedChannelsList,
} from "./hooks/use-channels-list";
import {
  CreatorChannelsListItemProps,
  CreatorChannelsListProps,
} from "./types";

const keyExtractor = (item: CreatorChannelsListItemProps) => {
  return item.type === "section" ? item.title : item.id.toString();
};

const CreatorChannelsHeader = memo(
  ({
    title,
    subtext,
    tw = "",
  }: {
    title: string;
    subtext?: string;
    tw?: string;
  }) => {
    return (
      <View tw="px-4 py-4">
        <Text
          tw={[
            "web:text-center text-2xl font-extrabold text-gray-900 dark:text-white",
            tw,
          ]}
        >
          {title}
        </Text>
        {subtext ? (
          <View tw="mt-3">
            <Text tw="text-sm leading-5 text-gray-500 dark:text-gray-400">
              {subtext}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
);

CreatorChannelsHeader.displayName = "CreatorChannelsHeader";

const CreatorChannelsListItem = memo(
  ({ item }: { item: CreatorChannelsListItemProps }) => {
    const time = formatDateRelativeWithIntl(
      item?.latest_message?.updated_at ?? Date.now()
    );
    const router = useRouter();
    const isDark = useIsDarkMode();
    return (
      <RectButton
        onPress={() => {
          router.push(`/channels/${item.id}`);
        }}
        underlayColor={isDark ? "white" : "black"}
        style={{ width: "100%" }}
      >
        <View tw="flex-1 px-4 py-3">
          <View tw="flex-row items-center">
            <AvatarHoverCard
              username={item.owner.username}
              url={item.owner.img_url}
              size={52}
              alt="CreatorPreview Avatar"
              tw={"mr-3"}
            />
            <View tw="flex-1">
              <View tw="flex-row items-center">
                <Text
                  tw="web:max-w-[80%] overflow-ellipsis whitespace-nowrap text-lg font-semibold text-black dark:text-white"
                  numberOfLines={1}
                >
                  {item.owner.username}
                </Text>
                <Text tw="ml-2 text-xs text-gray-500">{time}</Text>
              </View>
              <View tw="mt-2">
                <Text
                  tw="leading-5 text-gray-500 dark:text-gray-300"
                  numberOfLines={2}
                >
                  {item?.latest_message?.body}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </RectButton>
    );
  }
);

CreatorChannelsListItem.displayName = "CreatorChannelsListItem";

const CreatorChannelsListCreator = memo(
  ({ item }: { item: CreatorChannelsListItemProps }) => {
    const time = formatDateRelativeWithIntl(item.updated_at);
    const memberCount = new Intl.NumberFormat().format(item.member_count);
    return (
      <View tw="flex-1 px-4 py-3">
        <View tw="flex-row items-center">
          <AvatarHoverCard
            username={item.owner.username}
            url={item.owner.img_url}
            size={52}
            alt="CreatorPreview Avatar"
            tw={"mr-3"}
          />
          <View tw="flex-1 justify-center">
            <View tw="flex-1 flex-row items-center justify-center">
              <View tw="flex-1 items-start justify-start">
                <View tw="flex-1 flex-row items-center justify-start">
                  <Text
                    tw="web:max-w-[65%] max-w-[90%] overflow-ellipsis whitespace-nowrap text-lg font-semibold text-black dark:text-white"
                    numberOfLines={1}
                  >
                    {item.owner.username}
                  </Text>
                  {/* TODO: determine if we keep this */}
                  <Text tw="ml-2 hidden text-xs text-gray-500">{time}</Text>
                </View>
                <View tw="web:mt-1.5 flex-1">
                  <Text tw="font-semibold text-gray-500 dark:text-gray-500">
                    {memberCount} Members
                  </Text>
                </View>
              </View>
              <View tw="items-end justify-end">
                <View tw="rounded-full bg-black p-1 dark:bg-white">
                  <Text tw="px-6 font-bold text-white dark:text-black">
                    Join
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View tw="ml-[52px] pl-3">
          <Text
            tw="leading-5 text-gray-500 dark:text-gray-300"
            numberOfLines={2}
          >
            {item?.owner?.bio ?? "No bio"}
          </Text>
        </View>
      </View>
    );
  }
);

CreatorChannelsListCreator.displayName = "CreatorChannelsListCreator";

const channelsSection = {
  type: "section",
  title: "Channels",
  subtext:
    "Get exclusive updates, presale access and unreleased content from your favorite creators.",
};

const suggestedChannelsSection = {
  type: "section",
  title: "Popular creators",
  tw: "text-xl",
};

export const CreatorChannelsList = memo(
  ({ web_height = undefined }: { web_height?: number }) => {
    //const { data, fetchMore, refresh, isRefreshing, isLoadingMore, isLoading } = useChannelsList();

    const isDark = useIsDarkMode();
    const bottomBarHeight = usePlatformBottomHeight();
    const headerHeight = useHeaderHeight();
    const { height: windowHeight } = useWindowDimensions();

    // my own channels
    const { data: ownedChannelsData } = useOwnedChannelsList();

    // channels I'm a member of
    const {
      data: joinedChannelsData,
      fetchMore,
      refresh,
      isRefreshing,
      isLoadingMore,
      isLoading,
    } = useJoinedChannelsList();

    // suggested channels
    const { data: suggestedChannelsData } = useSuggestedChannelsList();

    const listRef = useRef<any>();
    useScrollToTop(listRef);

    // since we're quering two different endpoints, and based on the amount of data from the first endpoint
    // we have to transform our data a bit and decide if we build a section list or a single FlashList
    // we're going to useMemo for that and return the data in the format we need
    const transformedData = useMemo(() => {
      // if we have more then 15 items from the first endpoint, we're not going to build a section list
      // we're going to build a single FlashList, but we create a section if `data` is smaller than 15 items
      if (joinedChannelsData.length < 11) {
        return [
          // check if we have any owned channels, if we do, we're going to add a section for them (+ the joined channels)
          ...(ownedChannelsData.length > 0
            ? [channelsSection, ...ownedChannelsData]
            : []),

          // check if we have any joined channels, if we do, we're going to add a section for them (+ the joined channels)
          ...(joinedChannelsData.length > 0
            ? [channelsSection, ...joinedChannelsData]
            : []),
          // check if we have any suggested channels, if we do, we're going to add a section for them (+ the suggested channels)
          ...(suggestedChannelsData.length > 0
            ? [
                suggestedChannelsSection,
                ...suggestedChannelsData.map((suggestedChannel) => ({
                  ...suggestedChannel,
                  itemType: "creator",
                })),
              ]
            : []),
        ];
      } else {
        return [channelsSection, ...ownedChannelsData, ...joinedChannelsData];
      }
    }, [
      joinedChannelsData,
      ownedChannelsData,
      suggestedChannelsData,
    ]) as CreatorChannelsListItemProps[];

    const renderItem = useCallback(({ item }: CreatorChannelsListProps) => {
      if (item.type === "section") {
        return (
          <CreatorChannelsHeader
            title={item.title}
            subtext={item?.subtext}
            tw={item.tw}
          />
        );
      }

      if (item.itemType === "creator") {
        return <CreatorChannelsListCreator item={item} />;
      }

      return <CreatorChannelsListItem item={item} />;
    }, []);

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
        data={transformedData}
        getItemType={(item) => {
          // To achieve better performance, specify the type based on the item
          return item.type === "section"
            ? "sectionHeader"
            : item.itemType ?? "row";
        }}
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
        estimatedItemSize={110}
      />
    );
  }
);

CreatorChannelsList.displayName = "CreatorChannelsList";
