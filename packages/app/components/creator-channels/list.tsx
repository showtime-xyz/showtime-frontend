import {
  useCallback,
  memo,
  useRef,
  useMemo,
  RefObject,
  useReducer,
} from "react";
import { Platform, RefreshControl, useWindowDimensions } from "react-native";

import { RectButton } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Image } from "@showtime-xyz/universal.image";
import { FlashList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useUser } from "app/hooks/use-user";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { formatDateRelativeWithIntl } from "app/utilities";

import {
  AnimatedInfiniteScrollListWithRef,
  CustomCellRenderer,
} from "./components/animated-cell-container";
import {
  useJoinedChannelsList,
  useOwnedChannelsList,
  useSuggestedChannelsList,
} from "./hooks/use-channels-list";
import { useJoinChannel } from "./hooks/use-join-channel";
import {
  CreatorChannelsListItemProps,
  CreatorChannelsListProps,
} from "./types";

const keyExtractor = (item: CreatorChannelsListItemProps) => {
  return item.type === "section"
    ? item.title
    : `${item.itemType ?? "listItem"}-${item.id}`;
};

const PlatformPressable = Platform.OS === "web" ? Pressable : RectButton;
const AnimatedView = Animated.createAnimatedComponent(View);

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
      <AnimatedView
        tw="px-4 py-4"
        layout={Layout.duration(100)}
        entering={FadeIn}
        exiting={FadeOut}
      >
        <Text
          tw={[
            "web:text-xl text-2xl font-extrabold text-gray-900 dark:text-white",
            tw,
          ]}
        >
          {title}
        </Text>
        {subtext ? (
          <View tw="mt-3">
            <Text tw="web:text-xs  text-sm leading-5 text-gray-500 dark:text-gray-400">
              {subtext}
            </Text>
          </View>
        ) : null}
      </AnimatedView>
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
    // yes, react can be annoying sometimes
    const forceUpdate = useReducer((x) => x + 1, 0)[1];

    const getPreviewText = useCallback(() => {
      if (
        item?.latest_message &&
        item?.latest_message?.attachments.length > 0
      ) {
        // switch statement that returns image, video, audio, or file based on item?.latest_message?.attachments.mime
        if (item?.latest_message?.attachments[0].mime.includes("image"))
          return "🖼️ Image";

        if (item?.latest_message?.attachments[0].mime.includes("video"))
          return "🎥 Video";

        if (item?.latest_message?.attachments[0].mime.includes("audio"))
          return "🔊 Audio";

        return "No preview available";
      }

      // output the latest message if it exists
      if (item?.latest_message?.body) {
        return item?.latest_message?.body.trim();
      }

      // check if its a payment gated message and not paid already, so we output a generic message
      if (
        item?.latest_message?.is_payment_gated &&
        !item?.latest_message?.body
      ) {
        return (
          <View tw="flex-row items-center">
            <View tw="mr-2">
              <Image
                source={require("app/components/assets/st-logo.png")}
                width={18}
                height={18}
              />
            </View>
            <Text
              tw={[
                "text-sm",
                isDark ? "text-white" : "text-black",
                !item.read ? "font-semibold" : "",
              ]}
            >
              Collect to unlock
            </Text>
          </View>
        );
      }

      // if we don't have a latest message, we're going to output a default message when owned
      if (item.itemType === "owned") {
        return (
          <Text tw="font-semibold">
            Blast exclusive updates to all your fans at once like Music NFT
            presale access, raffles, unreleased content & more.
          </Text>
        );
      }

      return "";
    }, [isDark, item.itemType, item?.latest_message, item.read]);

    return (
      <PlatformPressable
        onPress={() => {
          router.push(`/channels/${item.id}`);
          item.read = true;
          requestAnimationFrame(() => {
            // doing this because I don't want to mutate the whole object for a simple read status
            forceUpdate();
          });
        }}
        underlayColor={isDark ? "white" : "black"}
        style={{ width: "100%" }}
      >
        <View tw="flex-1 px-4 py-2.5">
          <View tw="flex-row items-center">
            <Avatar
              url={item.owner.img_url}
              size={52}
              alt="CreatorPreview Avatar"
              tw={"pointer-events-none mr-3"}
            />
            <View tw="flex-1">
              <View tw="flex-row items-center">
                <Text
                  tw={[
                    "web:text-base max-w-[80%] overflow-ellipsis whitespace-nowrap text-lg font-semibold text-black dark:text-white",
                    item.itemType === "owned"
                      ? "web:max-w-[60%] max-w-[70%]"
                      : "",
                  ]}
                  numberOfLines={1}
                >
                  {item.owner.name ?? item.owner.username}
                </Text>

                {item.itemType === "owned" ? (
                  <Text
                    tw="web:max-w-[80%] web:text-base ml-3 overflow-ellipsis whitespace-nowrap text-lg font-medium text-gray-500 dark:text-slate-300"
                    numberOfLines={1}
                  >
                    you
                  </Text>
                ) : null}
                <Text tw="ml-2 text-xs text-gray-500">
                  {item?.latest_message?.updated_at ? time : ""}
                </Text>
              </View>
              <View tw="mt-2">
                <Text
                  tw={[
                    "leading-5",
                    !item?.read && item.itemType !== "owned"
                      ? "font-semibold text-black dark:text-white"
                      : "text-gray-500 dark:text-gray-200",
                  ]}
                  numberOfLines={2}
                >
                  {item.latest_message?.sent_by.profile.profile_id !==
                    item.owner.profile_id &&
                  (item.latest_message?.sent_by.profile.name ||
                    item.latest_message?.sent_by.profile.username) ? (
                    <Text tw="font-semibold">
                      {item.latest_message.sent_by.profile.name ||
                        item.latest_message.sent_by.profile.username}
                      {": "}
                    </Text>
                  ) : null}
                  {getPreviewText()}
                </Text>
              </View>
            </View>
            {item.itemType !== "owned" && !item.read ? (
              // we don't want to show the unread indicator for owned channels
              <View>
                <View tw="h-2 w-2 rounded-full bg-indigo-600" />
              </View>
            ) : null}
          </View>
        </View>
      </PlatformPressable>
    );
  }
);

CreatorChannelsListItem.displayName = "CreatorChannelsListItem";

const CreatorChannelsListCreator = memo(
  ({
    item,
    listRef,
  }: {
    item: CreatorChannelsListItemProps;
    listRef: RefObject<FlashList<any>>;
  }) => {
    const joinChannel = useJoinChannel();
    const router = useRouter();
    const time = formatDateRelativeWithIntl(item.updated_at);
    const memberCount = new Intl.NumberFormat().format(item.member_count);
    return (
      <View tw="flex-1 px-4 py-2.5">
        <View tw="flex-row items-center">
          <Avatar
            url={item.owner.img_url}
            size={52}
            alt="CreatorPreview Avatar"
            tw={"mr-3"}
          />
          <View tw="flex-1 justify-center">
            <View tw="flex-1 flex-row items-center justify-center">
              <View tw="flex-1 items-start justify-start">
                <View tw="w-full flex-1 flex-row items-center justify-start">
                  <Text
                    tw={[
                      "web:text-base w-full max-w-[90%] overflow-ellipsis whitespace-nowrap text-lg font-semibold text-black dark:text-white",
                    ]}
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
                <Pressable
                  tw={[
                    "rounded-full bg-black p-1 dark:bg-white",
                    joinChannel.isMutating ? "opacity-50" : "",
                  ]}
                  onPress={async () => {
                    listRef.current?.prepareForLayoutAnimationRender();
                    await joinChannel.trigger({ channelId: item.id });
                    router.push(`/channels/${item.id}?fresh=channel`);
                  }}
                  disabled={joinChannel.isMutating}
                >
                  <Text tw="px-6 font-bold text-white dark:text-black">
                    Join
                  </Text>
                </Pressable>
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
  ({ useWindowScroll = true }: { useWindowScroll?: boolean }) => {
    const listRef = useRef<FlashList<any>>(null);
    //@ts-expect-error still no support for FlashList as type
    useScrollToTop(listRef);
    const { isAuthenticated } = useUser();
    const isDark = useIsDarkMode();
    const bottomBarHeight = usePlatformBottomHeight();
    const headerHeight = useHeaderHeight();
    const { height: windowHeight } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    // my own channels
    const {
      data: ownedChannelsData,
      isLoading: isLoadingOwnChannels,
      refresh: refreshOwnedChannels,
      isRefreshing: isRefreshingOwnedChannels,
    } = useOwnedChannelsList();

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
      refresh: refreshSuggestedChannels,
      isLoading: isLoadingSuggestedChannels,
      isRefreshing: isRefreshingSuggestedChannels,
    } = useSuggestedChannelsList();

    // since we're quering two different endpoints, and based on the amount of data from the first endpoint
    // we have to transform our data a bit and decide if we build a section list or a single FlashList
    // we're going to useMemo for that and return the data in the format we need
    const transformedData = useMemo(() => {
      // if we have more then 15 items from the first endpoint, we're not going to build a section list
      // we're going to build a single FlashList, but we create a section if `data` is smaller than 15 items
      if (joinedChannelsData.length < 11) {
        return [
          channelsSection,
          // check if we have any joined channels, if we do, we're going to add a section for them (+ the joined channels)
          ...(joinedChannelsData.length > 0 || ownedChannelsData.length > 0
            ? [
                ...ownedChannelsData.map((ownedChannel) => ({
                  ...ownedChannel,
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
        return [
          channelsSection,
          ...(ownedChannelsData.length > 0
            ? [
                ...ownedChannelsData.map((ownedChannel) => ({
                  ...ownedChannel,
                  itemType: "owned",
                })),
              ]
            : []),
          ...joinedChannelsData,
        ];
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
        return <CreatorChannelsListCreator item={item} listRef={listRef} />;
      }

      return <CreatorChannelsListItem item={item} />;
    }, []);

    const ListFooterComponent = useCallback(() => {
      if (!isAuthenticated) return null;
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
      if (Platform.OS === "web" && useWindowScroll) {
        return <View style={{ height: bottomBarHeight }} />;
      }
      return null;
    }, [
      isAuthenticated,
      isLoadingOwnChannels,
      isLoadingJoinedChannels,
      isLoadingMoreJoinedChannels,
      bottomBarHeight,
      useWindowScroll,
    ]);

    const refreshPage = useCallback(async () => {
      await Promise.all([
        refresh(),
        refreshOwnedChannels(),
        refreshSuggestedChannels(),
      ]);
    }, [refresh, refreshOwnedChannels, refreshSuggestedChannels]);
    if (
      isLoadingOwnChannels ||
      isLoadingJoinedChannels ||
      isLoadingSuggestedChannels
    ) {
      return <CCSkeleton />;
    }
    return (
      <AnimatedInfiniteScrollListWithRef
        ref={listRef}
        useWindowScroll={useWindowScroll}
        data={transformedData}
        getItemType={(item) => {
          // To achieve better performance, specify the type based on the item
          return item.type === "section"
            ? "sectionHeader"
            : item.itemType ?? "row";
        }}
        style={{
          flexGrow: 1,
          paddingTop: insets.top,
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
            refreshing={
              isRefreshing ||
              isRefreshingOwnedChannels ||
              isRefreshingSuggestedChannels
            }
            onRefresh={refreshPage}
            progressViewOffset={headerHeight}
            tintColor={isDark ? colors.gray[200] : colors.gray[700]}
            colors={[colors.violet[500]]}
            progressBackgroundColor={
              isDark ? colors.gray[200] : colors.gray[100]
            }
          />
        }
        drawDistance={windowHeight * 2}
        CellRendererComponent={CustomCellRenderer}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={fetchMore}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListFooterComponent={ListFooterComponent}
        estimatedItemSize={80}
      />
    );
  }
);

CreatorChannelsList.displayName = "CreatorChannelsList";

const CCSkeleton = () => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  return (
    <View
      tw="mt-4 px-4"
      style={{
        marginTop: Platform.select({
          web: 0,
          default: headerHeight + insets.top,
        }),
      }}
    >
      {new Array(8).fill(0).map((_, i) => {
        return (
          <View tw="flex-row pt-4" key={`${i}`}>
            <View tw="mr-2 overflow-hidden rounded-full">
              <Skeleton width={52} height={52} show />
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
