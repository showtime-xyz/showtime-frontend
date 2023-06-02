import { useCallback, memo, useRef, useMemo } from "react";
import { Platform, RefreshControl, useWindowDimensions } from "react-native";

import { RectButton } from "react-native-gesture-handler";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronLeft } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { Link } from "app/navigation/link";
import { formatDateRelativeWithIntl } from "app/utilities";

import { breakpoints } from "design-system/theme";

import {
  useJoinedChannelsList,
  useOwnedChannelsList,
  useSuggestedChannelsList,
} from "./hooks/use-channels-list";
import { useJoinChannel } from "./hooks/use-join-channel";
import { CreatorChannelsList as CreatorChannelsListMobile } from "./list";
import { Messages } from "./messages";
import {
  CreatorChannelsListItemProps,
  CreatorChannelsListProps,
} from "./types";

const keyExtractor = (item: CreatorChannelsListItemProps) => {
  return item.type === "section" ? item.title : item.id.toString();
};

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
        <Text tw={["text-xl font-bold text-gray-900 dark:text-white", tw]}>
          {title}
        </Text>
        {subtext ? (
          <View tw="mt-3">
            <Text tw="text-xs leading-5 text-gray-500 dark:text-gray-400">
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
      item.latest_message?.updated_at ?? Date.now()
    );
    const router = useRouter();
    const currentChannel = useMemo(() => router.query["channelId"], [router]);

    return (
      <Pressable
        onPress={() => {
          router.push(`/channels/${item.id}`);
        }}
        style={{ width: "100%" }}
      >
        <View
          tw={[
            "mx-3 my-1 flex-1 cursor-pointer rounded-lg px-2 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-900",
            currentChannel === item.id.toFixed()
              ? "bg-gray-100 dark:bg-gray-900"
              : "", // TODO: toFixed might to be changed with slugs
          ]}
        >
          <View tw="flex-row items-start justify-start">
            <AvatarHoverCard
              username={item.owner.username}
              url={item.owner.img_url}
              size={40}
              alt="CreatorPreview Avatar"
              tw={"mr-3"}
            />
            <View tw="flex-1">
              <View tw="flex-row items-center">
                <Text
                  tw="text-md max-w-[160px] overflow-ellipsis whitespace-nowrap text-[15px] font-semibold text-black dark:text-white"
                  numberOfLines={1}
                >
                  {item.owner.name ?? item.owner.username}
                </Text>
                {item.itemType === "owned" ? (
                  <Text
                    tw="text-md ml-3 max-w-[160px] overflow-ellipsis whitespace-nowrap text-[15px] font-semibold text-gray-500 dark:text-white"
                    numberOfLines={1}
                  >
                    you
                  </Text>
                ) : null}
                <Text tw="ml-2 text-xs text-gray-500">
                  {item?.latest_message?.updated_at ? time : ""}
                </Text>
              </View>
              <View tw="mt-1">
                <Text
                  tw={[
                    "text-[13px] ",
                    item?.unread
                      ? "font-semibold text-black dark:text-white"
                      : "text-gray-500 dark:text-gray-300",
                  ]}
                  numberOfLines={2}
                >
                  {item?.latest_message?.body ? (
                    item?.latest_message?.body.trim()
                  ) : item.itemType === "owned" ? (
                    <Text tw="font-semibold">
                      Blast exclusive updates to all your fans at once like
                      Music NFT presale access, raffles, unreleased content &
                      more.
                    </Text>
                  ) : (
                    ""
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }
);

CreatorChannelsListItem.displayName = "CreatorChannelsListItem";

const CreatorChannelsListCreator = memo(
  ({ item }: { item: CreatorChannelsListItemProps }) => {
    const joinChannel = useJoinChannel();

    const memberCount = new Intl.NumberFormat().format(item.member_count);
    return (
      <View tw="flex-1 px-4 py-3">
        <View tw="flex-row items-start">
          <AvatarHoverCard
            username={item.owner.username}
            url={item.owner.img_url}
            size={40}
            alt="CreatorPreview Avatar"
            tw={"mr-3"}
          />
          <View tw="flex-1 justify-center">
            <View tw="flex-1 flex-row items-center justify-center">
              <View tw="flex-1 items-start justify-start">
                <View tw="flex-1 flex-row items-start justify-start">
                  <Link
                    href={`/@${
                      item.owner.username ?? item.owner.wallet_address
                    }`}
                  >
                    <Text
                      tw="text-md max-w-[160px] overflow-ellipsis whitespace-nowrap text-[15px] font-semibold text-black dark:text-white"
                      numberOfLines={1}
                    >
                      {item.owner.name ?? item.owner.username}
                    </Text>
                  </Link>
                </View>
                <View tw="mt-1 flex-1">
                  <Text tw="text-[11px] font-bold text-gray-500 dark:text-gray-500">
                    {memberCount} Members
                  </Text>
                </View>
              </View>
              <View tw="items-end justify-end">
                <Pressable
                  tw="rounded-full bg-black p-1 dark:bg-white"
                  onPress={() => {
                    joinChannel.trigger({ channelId: item.id });
                  }}
                  disabled={joinChannel.isMutating}
                >
                  <Text tw="px-2.5 py-0.5 text-xs font-bold text-white dark:text-black">
                    {joinChannel.isMutating ? "Joining..." : "Join"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        <View tw="ml-[40px] mt-1 pl-3">
          <Text
            tw="text-[13px] text-gray-500 dark:text-gray-300"
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

export const CreatorChannels = memo(
  ({ web_height = undefined }: { web_height?: number }) => {
    //const { data, fetchMore, refresh, isRefreshing, isLoadingMore, isLoading } = useChannelsList();

    const isDark = useIsDarkMode();
    const bottomBarHeight = usePlatformBottomHeight();
    const headerHeight = useHeaderHeight();
    const { height: windowHeight, width } = useWindowDimensions();
    const isMdWidth = width >= breakpoints["md"];
    const router = useRouter();
    const listRef = useRef<any>();
    useScrollToTop(listRef);

    // my own channels
    const { data: ownedChannelsData, isLoading: isLoadingOwnChannels } =
      useOwnedChannelsList();

    // channels I'm a member of
    const {
      data: joinedChannelsData,
      fetchMore,
      refresh,
      isRefreshing,
      isLoadingMore: isLoadingMoreJoinedChannels,
      isLoading: isLoadingJoinedChannels,
    } = useJoinedChannelsList();

    // suggested channels
    const {
      data: suggestedChannelsData,
      isLoading: isLoadingSuggestedChannels,
    } = useSuggestedChannelsList();

    // since we're quering two different endpoints, and based on the amount of data from the first endpoint
    // we have to transform our data a bit and decide if we build a section list or a single FlashList
    // we're going to useMemo for that and return the data in the format we need
    const transformedData = useMemo(() => {
      // if we have more then 15 items from the first endpoint, we're not going to build a section list
      // we're going to build a single FlashList, but we create a section if `data` is smaller than 15 items
      if (joinedChannelsData.length < 11) {
        return [
          // check if we have any joined channels, if we do, we're going to add a section for them (+ the joined channels)
          ...(joinedChannelsData.length > 0 || ownedChannelsData.length > 0
            ? [
                channelsSection,
                ...ownedChannelsData.map((suggestedChannel) => ({
                  ...suggestedChannel,
                  itemType: "owned",
                })),
                ...joinedChannelsData,
              ]
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
      if (
        isLoadingJoinedChannels ||
        isLoadingOwnChannels ||
        isLoadingSuggestedChannels
      ) {
        return <CCSkeleton />;
      }

      if (
        !isLoadingOwnChannels &&
        !isLoadingJoinedChannels &&
        isLoadingMoreJoinedChannels
      ) {
        return (
          <View tw="items-center pb-4 pt-4">
            <Spinner size="small" />
          </View>
        );
      }

      return null;
    }, [
      isLoadingJoinedChannels,
      isLoadingOwnChannels,
      isLoadingSuggestedChannels,
      isLoadingMoreJoinedChannels,
    ]);
    const mdHeight = windowHeight - 140;

    if (!isMdWidth) {
      if (router.query["channelId"]) {
        return <Messages />;
      }

      return (
        <View tw="w-full">
          <CreatorChannelsListMobile />
        </View>
      );
    }

    return (
      <View
        tw="mt-24 w-full max-w-screen-lg flex-row px-4"
        style={{ height: mdHeight }}
      >
        <Button
          iconOnly
          size="regular"
          variant="secondary"
          tw="absolute md:hidden lg:-left-12 lg:flex"
          onPress={() => router.push("/")}
        >
          <ChevronLeft width={24} height={24} />
        </Button>
        <View tw="h-full w-80 overflow-hidden rounded-2xl bg-white dark:bg-black">
          <InfiniteScrollList
            useWindowScroll={false}
            data={
              isLoadingOwnChannels ||
              isLoadingJoinedChannels ||
              isLoadingSuggestedChannels
                ? []
                : transformedData
            }
            getItemType={(item) => {
              // To achieve better performance, specify the type based on the item
              return item.type === "section"
                ? "sectionHeader"
                : item.itemType ?? "row";
            }}
            style={{
              height: mdHeight,
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
        </View>
        <View tw="ml-3 h-full flex-1 overflow-hidden rounded-2xl bg-white dark:bg-black">
          <Messages />
        </View>
      </View>
    );
  }
);

CreatorChannels.displayName = "CreatorChannels";

const CCSkeleton = () => {
  return (
    <View tw="px-5">
      {new Array(8).fill(0).map((_, i) => {
        return (
          <View tw="flex-row pt-4" key={`${i}`}>
            <View tw="mr-2 overflow-hidden rounded-full">
              <Skeleton width={42} height={42} show />
            </View>
            <View>
              <Skeleton width={140} height={14} show />
              <View tw="h-1" />
              <Skeleton width={90} height={14} show />
            </View>
          </View>
        );
      })}
    </View>
  );
};
