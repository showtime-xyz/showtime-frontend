import {
  useCallback,
  useEffect,
  memo,
  useRef,
  useState,
  useMemo,
  useLayoutEffect,
} from "react";
import { Platform, useWindowDimensions } from "react-native";

import axios from "axios";
import * as Clipboard from "expo-clipboard";
import { AvoidSoftInput } from "react-native-avoid-softinput";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  runOnJS,
  useSharedValue,
  SlideInDown,
  SlideOutDown,
  enableLayoutAnimations,
} from "react-native-reanimated";
import { useSWRConfig } from "swr";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { CreatorChannelFilled } from "@showtime-xyz/universal.icon";
import {
  ListRenderItem,
  FlashList,
} from "@showtime-xyz/universal.infinite-scroll-list";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import Spinner from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useIntroducingCreatorChannels } from "app/components/onboarding/introducing-creator-channels";
import { useUserProfile } from "app/hooks/api-hooks";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailBySlug } from "app/hooks/use-nft-details-by-slug";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useRedirectToChannelCongrats } from "app/hooks/use-redirect-to-channel-congrats";
import { useRedirectToCreatorTokenSocialShare } from "app/hooks/use-redirect-to-creator-token-social-share-screen";
import { useUser } from "app/hooks/use-user";
import {
  useReanimatedKeyboardAnimation,
  KeyboardController,
  AndroidSoftInputModes,
} from "app/lib/keyboard-controller";
import { createParam } from "app/navigation/use-param";

import { breakpoints } from "design-system/theme";
import { toast } from "design-system/toast";
import TrackPlayer from "design-system/track-player";

import { setupPlayer } from "../audio-player/service";
import { pauseAllActiveTracks } from "../audio-player/store";
import {
  AnimatedInfiniteScrollListWithRef,
  CustomCellRenderer,
} from "./components/animated-cell-container";
import { MessageInput, ScrollToBottomButton } from "./components/message-input";
import { MessageItem } from "./components/message-item";
import { MessageSkeleton } from "./components/message-skeleton";
import { MessagesHeader } from "./components/messages-header";
import { useChannelById } from "./hooks/use-channel-detail";
import { useChannelMessages } from "./hooks/use-channel-messages";
import { UNREAD_MESSAGES_KEY } from "./hooks/use-channels-unread-messages";
import { ChannelMessageItem } from "./types";

const AnimatedView = Animated.createAnimatedComponent(View);

type Query = {
  channelId: string;
  fresh?: string;
};
const { useParam } = createParam<Query>();

const keyExtractor = (item: ChannelMessageItem) =>
  item.channel_message.id.toString();

const getItemType = (item: ChannelMessageItem) => {
  /*
  if (
    item.channel_message.is_payment_gated &&
    !item.channel_message.body &&
    !item.channel_message?.attachments
  ) {
    return "payment-gate";
  }
  */

  if (
    item.channel_message?.attachments &&
    item.channel_message?.attachments[0]?.mime
  ) {
    if (item.channel_message?.attachments[0].mime.includes("video")) {
      return "video";
    }
    if (item.channel_message?.attachments[0].mime.includes("audio")) {
      return "audio";
    }
    if (item.channel_message?.attachments[0].mime.includes("image")) {
      if (
        item.channel_message?.attachments[0].height! >
        item.channel_message?.attachments[0].width!
      ) {
        return "image-portrait";
      }

      if (
        item.channel_message?.attachments[0].height! <
        item.channel_message?.attachments[0].width!
      ) {
        return "image-landscape";
      }

      if (
        item.channel_message?.attachments[0].height ===
        item.channel_message?.attachments[0].width
      ) {
        return "image-square";
      }
    }
  }

  return "message";
};

export const Messages = memo(() => {
  const { mutate: globalMutate } = useSWRConfig();
  const listRef = useRef<FlashList<any>>(null);
  const [channelId] = useParam("channelId");
  const [fresh] = useParam("fresh");
  const insets = useSafeAreaInsets();
  const bottomHeight = usePlatformBottomHeight();
  //const { height, width } = useWindowDimensions();
  const [editMessage, setEditMessage] = useState<
    undefined | { id: number; text: string }
  >();
  const router = useRouter();
  const isDark = useIsDarkMode();
  const user = useUser();
  const windowDimension = useWindowDimensions();
  const isMdWidth = windowDimension.width >= breakpoints["md"];
  const redirectToChannelCongrats = useRedirectToChannelCongrats();
  const isUserAdmin =
    user.user?.data.channels &&
    user.user?.data.channels[0] === Number(channelId);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const editMessageIdSharedValue = useSharedValue<undefined | number>(
    undefined
  );
  const redirectToCreatorTokenSocialShare =
    useRedirectToCreatorTokenSocialShare();
  const isScrolling = useSharedValue<boolean>(false);
  const keyboard =
    Platform.OS !== "web"
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useReanimatedKeyboardAnimation()
      : { height: { value: 0 }, state: {} };

  const editMessageItemDimension = useSharedValue({ pageY: 0, height: 0 });

  // when component unmounts, reset all running player instances
  useLayoutEffect(() => {
    queueMicrotask(async () => {
      await setupPlayer();
      await TrackPlayer.reset();
      pauseAllActiveTracks();
    });

    // yes, this is weird but we need it to run on unmount as well
    return () => {
      queueMicrotask(() => {
        TrackPlayer.reset();
        pauseAllActiveTracks();
      });
    };
  }, [channelId]);

  useEffect(() => {
    editMessageIdSharedValue.value = editMessage?.id;
    if (!editMessage) {
      editMessageItemDimension.value = { pageY: 0, height: 0 };
    }
  }, [editMessage, editMessageIdSharedValue, editMessageItemDimension]);

  const scrollhandler = useAnimatedScrollHandler({
    onMomentumBegin: (event) => {
      if (event.contentOffset.y > windowDimension.height / 4) {
        runOnJS(setShowScrollToBottom)(true);
      } else {
        runOnJS(setShowScrollToBottom)(false);
      }
    },
    onMomentumEnd: (event) => {
      if (event.contentOffset.y > windowDimension.height / 4) {
        runOnJS(setShowScrollToBottom)(true);
      } else {
        runOnJS(setShowScrollToBottom)(false);
      }
      /*
      if (isScrolling.value) {
        //runOnJS(enableLayoutAnimations)(true);
      }
      */
      isScrolling.value = false;
    },
    onScroll: () => {
      if (!isScrolling.value) {
        // we need to disable LayoutAnimtions when scrolling
        isScrolling.value = true;
        runOnJS(enableLayoutAnimations)(false);
      }
    },
  });

  const channelDetail = useChannelById(channelId);
  const membersCount = channelDetail.data?.member_count || 0;

  const { data: dropDataBySlug, isLoading: nftDetailLoading } =
    useNFTDetailBySlug({
      username: channelDetail?.data?.owner.username,
      dropSlug: channelDetail.data?.latest_paid_nft_slug,
    });

  const { data: edition, loading: editionDetailLoading } =
    useCreatorCollectionDetail(dropDataBySlug?.creator_airdrop_edition_address);

  const hasUnlockedMessage = channelDetail.data?.viewer_has_unlocked_messages;
  const showCollectToUnlock =
    !isUserAdmin &&
    !hasUnlockedMessage &&
    channelDetail.data?.latest_paid_nft_slug;

  useIntroducingCreatorChannels();

  useEffect(() => {
    AvoidSoftInput?.setEnabled(false);
    KeyboardController?.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_NOTHING
    );

    return () => {
      AvoidSoftInput?.setEnabled(true);
      KeyboardController?.setDefaultMode();
      enableLayoutAnimations(false);
    };
  }, []);

  const shareLink = useCallback(async () => {
    const username = channelDetail.data?.owner.username;
    if (isMdWidth) {
      await Clipboard.setStringAsync(
        `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/@${username}`
      );
      toast.success("Copied!");
    } else {
      redirectToCreatorTokenSocialShare(username);
    }
  }, [
    channelDetail.data?.owner.username,
    isMdWidth,
    redirectToCreatorTokenSocialShare,
  ]);

  const { data, isLoading, fetchMore, isLoadingMore, error } =
    useChannelMessages(channelId);

  const isCurrentUserOwner =
    channelDetail.data?.owner.profile_id === user.user?.data.profile.profile_id;

  const onLoadMore = useCallback(async () => {
    fetchMore();
  }, [fetchMore]);

  // this effect fires only once after isLoading changed from true to false
  // after the first load of the messages we mutate the unread messages count
  useEffect(() => {
    if (!isLoading) {
      // trigger at the next tick to release stress from JS thread
      requestAnimationFrame(() => {
        globalMutate(UNREAD_MESSAGES_KEY);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useLayoutEffect(() => {
    if (isLoadingMore) {
      enableLayoutAnimations(false);
    }
  }, [isLoadingMore]);

  // the channel does not exist, redirect to the channels page
  useEffect(() => {
    if (error && axios.isAxiosError(error)) {
      if (error?.response?.status === 404) {
        router.replace("/channels");
        return;
      }
    }
  }, [channelId, error, router]);

  // this check is an extra check in case of 401 error
  // the user most likely follwed a link to a channel that they are not a member of
  // TODO: show a modal to ask the user to join the channel
  // for now we redirect to the profile instead
  useEffect(() => {
    if (!fresh && error && axios.isAxiosError(error)) {
      if (error?.response?.status === 401 && channelDetail.data?.owner) {
        router.replace(
          `/@${
            channelDetail.data?.owner.username ??
            channelDetail.data?.owner.wallet_address
          }`
        );
      }
    }
  }, [channelDetail.data?.owner, error, router, fresh]);

  const transformedData = useMemo(() => {
    let consecutiveCount = 0; // Initialize the consecutive message count

    return data.map((item, index, array) => {
      let isSameSenderAsNext = false;

      if (index < array.length - 1) {
        const currentSenderId = item.channel_message.sent_by.profile.profile_id;
        const nextSenderId =
          array[index + 1].channel_message.sent_by.profile.profile_id;

        const currentDate = new Date(item.channel_message.created_at).getTime();
        const nextDate = new Date(
          array[index + 1].channel_message.created_at
        ).getTime();
        const dayDifference =
          Math.abs(currentDate - nextDate) / (1000 * 60 * 60 * 24);

        // Increment count or reset if sender changes
        if (currentSenderId === nextSenderId) {
          consecutiveCount++;
        } else {
          consecutiveCount = 0; // Reset count if sender changes
        }

        // Check for same sender as next, less than a day's difference, and not the 5th message in a row
        isSameSenderAsNext =
          currentSenderId === nextSenderId &&
          dayDifference < 1 &&
          consecutiveCount % 10 !== 0;
      } else {
        // For the last item in the list, always show the sender
        isSameSenderAsNext = false;
      }

      return { ...item, isSameSenderAsNext };
    });
  }, [data]);

  const renderItem: ListRenderItem<ChannelMessageItem> = useCallback(
    ({ item, index, extraData }) => {
      return (
        <MessageItem
          item={item}
          index={index}
          reactions={extraData.reactions}
          channelId={extraData.channelId}
          listRef={listRef}
          setEditMessage={setEditMessage}
          editMessageIdSharedValue={editMessageIdSharedValue}
          editMessageItemDimension={editMessageItemDimension}
          edition={edition}
          isUserAdmin={isUserAdmin}
          permissions={channelDetail.data?.permissions}
          channelOwnerProfileId={channelDetail?.data?.owner.profile_id}
        />
      );
    },
    [
      editMessageIdSharedValue,
      editMessageItemDimension,
      edition,
      isUserAdmin,
      channelDetail.data?.permissions,
      channelDetail.data?.owner.profile_id,
    ]
  );

  // TODO: add back to keyboard controller?
  /*
  const style = useAnimatedStyle(() => {
    // Bring edit message to the center of the screen
    if (
      editMessageItemDimension.value.height &&
      editMessageItemDimension.value.pageY < windowDimension.height / 2
    ) {
      return {};
    } else {
      return {};
    }
  }, [keyboard]);
  */

  const introCompensation = useAnimatedStyle(
    () => ({
      top: keyboard.height.value / 2 + 16,
    }),
    [keyboard]
  );

  const listEmptyComponent = useCallback(() => {
    return (
      <AnimatedView
        tw="ios:scale-y-[-1] android:scale-y-[1] web:justify-start android:rotate-180 w-full items-center justify-center"
        style={[
          Platform.OS !== "web"
            ? { height: windowDimension.height }
            : { height: "100%" },
          introCompensation,
        ]}
      >
        <View tw="mt-6 w-full items-center justify-center">
          {isUserAdmin && (
            <>
              <View tw="w-full max-w-[357px] rounded-2xl border border-gray-300 bg-gray-100 pb-3 pt-3 dark:border-gray-800 dark:bg-gray-900">
                <View tw="px-6 pt-1">
                  <View tw="flex-row items-center">
                    <View tw="mr-4 h-10 w-10 items-center justify-center rounded-full bg-white">
                      <CreatorChannelFilled
                        width={22}
                        height={22}
                        color={"black"}
                      />{" "}
                    </View>
                    <Text tw="text-sm font-bold text-black dark:text-white">
                      Welcome! Let's get this party started.{" "}
                      <Text tw="font-normal">
                        A groupchat for your community where you can share
                        audio, pictures & more.
                      </Text>
                    </Text>
                  </View>

                  <Button tw="mt-5" onPress={shareLink}>
                    Share
                  </Button>
                </View>
              </View>
              {/* TODO: Creator Tokens P1
              <View tw="mt-5 w-full max-w-[357px] rounded-2xl border border-gray-300 bg-gray-100 pb-3 pt-3 dark:border-gray-800 dark:bg-gray-900">
                <View tw="px-6 pt-1">
                  <View tw="flex-row items-center">
                    <View tw="mr-4 h-10 w-10 items-center justify-center rounded-full bg-white">
                      <ShowtimeRounded width={26} height={26} color={"black"} />
                    </View>
                    <Text tw="text-sm font-bold text-black dark:text-white">
                      Invite a creator, earn their token for free.{" "}
                      <Text tw="font-normal">
                        3 invites left to send your friends.
                      </Text>
                    </Text>
                  </View>
                  <Button
                    tw="mt-5"
                    onPress={() => {
                      router.push("/profile/invite-creator-token");
                    }}
                  >
                    Invite
                  </Button>
                </View>
              </View>
              */}
            </>
          )}
        </View>
      </AnimatedView>
    );
  }, [introCompensation, isUserAdmin, shareLink, windowDimension.height]);

  const extraData = useMemo(
    () => ({ reactions: channelDetail.data?.channel_reactions, channelId }),
    [channelDetail.data?.channel_reactions, channelId]
  );
  const sendMessageCallback = useCallback(() => {
    if (data?.length !== 0) return;
    redirectToChannelCongrats(channelId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length, channelId]);

  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.max(Math.abs(keyboard.height.value), 0),
    }),
    [keyboard]
  );

  const renderListHeader = useCallback(
    () => <AnimatedView style={fakeView} />,
    [fakeView]
  );

  const renderListFooter = useCallback(() => {
    if (isLoadingMore) {
      return (
        <View tw="w-full items-center py-4">
          <Spinner size="small" />
        </View>
      );
    }
    return null;
  }, [isLoadingMore]);

  const channelOwnerProfile = useUserProfile({
    address: channelDetail.data?.owner.username,
  });

  if (!channelId) {
    return (
      <View tw="animate-fade-in-250 h-full w-full flex-1 items-center justify-center">
        <View tw="animate-fade-in-250 h-full w-full max-w-sm flex-1 items-center justify-center">
          <CreatorChannelFilled
            width={80}
            height={80}
            color={isDark ? colors.gray[800] : colors.gray[100]}
          />
          <View tw="h-3" />
          <Text tw="text-center text-2xl font-bold text-gray-900 dark:text-white">
            Select a channel!
          </Text>
          <View tw="h-5" />
          <Text tw="text-center text-xl font-semibold text-gray-900 dark:text-white">
            To join a channel, browse popular creators or collect a drop.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View
        key={channelId}
        tw="w-full flex-1 bg-white dark:bg-black"
        style={{
          paddingTop: insets.top,
          paddingBottom: Platform.select({
            web: bottomHeight,
          }),
        }}
      >
        <MessagesHeader
          username={channelDetail.data?.owner.username}
          title={
            channelDetail.data?.owner.name ?? channelDetail.data?.owner.username
          }
          picture={channelDetail.data?.owner.img_url}
          onPressSettings={() => {
            const as = `/channels/${channelId}/settings`;
            router.push(
              Platform.select({
                native: as,
                web: {
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    channelsSettingsModal: true,
                  },
                } as any,
              }),
              Platform.select({
                native: as,
                web: router.asPath,
              }),
              { shallow: true }
            );
          }}
          isCurrentUserOwner={isCurrentUserOwner}
          onPressShare={shareLink}
          members={membersCount}
          channelId={channelId}
        />
        <AnimatedView
          tw={[
            "flex-1 overflow-hidden",
            //isUserAdmin ? "android:pb-12 ios:pb-8 web:pb-12" : "",
            showCollectToUnlock ? "pb-2" : "", // since we always show the input, leave the padding
          ]}
        >
          {isLoading ||
          channelDetail.isLoading ||
          (showCollectToUnlock &&
            (nftDetailLoading || editionDetailLoading)) ? (
            <MessageSkeleton />
          ) : (
            <>
              <AnimatedInfiniteScrollListWithRef
                ref={listRef}
                keyExtractor={keyExtractor}
                data={transformedData}
                onEndReached={onLoadMore}
                inverted
                getItemType={getItemType}
                drawDistance={200}
                scrollEnabled={data.length > 0}
                overscan={4}
                onScroll={scrollhandler}
                useWindowScroll={false}
                estimatedItemSize={300}
                // android > 12 flips the scrollbar to the left, FlashList bug
                showsVerticalScrollIndicator={Platform.OS !== "android"}
                keyboardDismissMode={
                  Platform.OS === "ios" ? "interactive" : "on-drag"
                }
                renderItem={renderItem}
                extraData={extraData}
                ListHeaderComponent={renderListHeader}
                CellRendererComponent={CustomCellRenderer}
                ListEmptyComponent={listEmptyComponent}
                ListFooterComponent={renderListFooter}
              />
            </>
          )}
        </AnimatedView>
        <MessageInput
          listRef={listRef}
          channelId={channelId}
          sendMessageCallback={sendMessageCallback}
          setEditMessage={setEditMessage}
          editMessage={editMessage}
          isUserAdmin={isUserAdmin}
          keyboard={keyboard}
          edition={edition}
          hasUnlockedMessages={hasUnlockedMessage}
          permissions={channelDetail.data?.permissions}
          channelOwnerProfile={channelOwnerProfile.data?.data?.profile}
        />

        {showScrollToBottom ? (
          <Animated.View entering={SlideInDown} exiting={SlideOutDown}>
            <View tw="absolute bottom-[130px] right-4">
              <ScrollToBottomButton
                onPress={() => {
                  listRef.current?.scrollToOffset({
                    offset: 0,
                    animated: true,
                  });
                  // since android does not trigger onMomentScrollEnd imperatively, we need to hide the button manually
                  if (Platform.OS === "android") {
                    setShowScrollToBottom(false);
                  }
                }}
              />
            </View>
          </Animated.View>
        ) : null}
      </View>
    </>
  );
});

Messages.displayName = "Messages";
