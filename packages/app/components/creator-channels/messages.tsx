import {
  useCallback,
  useEffect,
  memo,
  useRef,
  useState,
  useMemo,
  RefObject,
} from "react";
import { Platform, useWindowDimensions } from "react-native";

import axios from "axios";
import { MotiView, AnimatePresence } from "moti";
import { AvoidSoftInput } from "react-native-avoid-softinput";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  runOnJS,
  useSharedValue,
  runOnUI,
  FadeOut,
  measure,
  FadeIn,
  SlideInDown,
  useAnimatedRef,
  SlideOutDown,
  Layout,
} from "react-native-reanimated";

import { AnimateHeight } from "@showtime-xyz/universal.accordion";
import { useAlert } from "@showtime-xyz/universal.alert";
import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  ArrowLeft,
  Edit,
  EyeOffV2,
  GiftV2,
  LockRounded,
  Check,
  Close,
  Music,
  Settings,
  Share,
  Shopping,
  Trash,
  ChevronDown,
  Flag,
  CreatorChannelFilled,
} from "@showtime-xyz/universal.icon";
import { MoreHorizontal } from "@showtime-xyz/universal.icon";
import {
  ListRenderItem,
  FlashList,
} from "@showtime-xyz/universal.infinite-scroll-list";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import Spinner from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
import { MessageBox } from "app/components/messages";
import { useIntroducingCreatorChannels } from "app/components/onboarding/introducing-creator-channels";
import { Reaction } from "app/components/reaction";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useRedirectToChannelCongrats } from "app/hooks/use-redirect-to-channel-congrats";
import { useShare } from "app/hooks/use-share";
import { useUser } from "app/hooks/use-user";
import { Analytics, EVENTS } from "app/lib/analytics";
import { linkifyDescription } from "app/lib/linkify";
import { Link } from "app/navigation/link";
import { createParam } from "app/navigation/use-param";
import {
  cleanUserTextInput,
  formatDateRelativeWithIntl,
  getWebBaseURL,
  limitLineBreaks,
  removeTags,
} from "app/utilities";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";

import { MenuItemIcon } from "../dropdown/menu-item-icon";
import { MessageReactions } from "../reaction/message-reactions";
import {
  AnimatedInfiniteScrollListWithRef,
  CustomCellRenderer,
} from "./animated-cell-container";
import { useChannelById } from "./hooks/use-channel-detail";
import {
  ChannelMessageItem,
  useChannelMessages,
} from "./hooks/use-channel-messages";
import { useDeleteMessage } from "./hooks/use-delete-message";
import { useEditChannelMessage } from "./hooks/use-edit-channel-message";
import { useReactOnMessage } from "./hooks/use-react-on-message";
import { useSendChannelMessage } from "./hooks/use-send-channel-message";
import { HeaderProps, MessageItemProps } from "./types";

const PlatformAnimateHeight = Platform.OS === "web" ? AnimateHeight : View;
const AnimatedView = Animated.createAnimatedComponent(View);

const ScrollToBottomButton = ({ onPress }: { onPress: any }) => {
  return (
    <Pressable
      onPress={onPress}
      tw="items-center justify-center rounded-full bg-black/40 p-1 dark:bg-white/40"
    >
      <ChevronDown height={32} width={32} color="white" />
    </Pressable>
  );
};

const Header = (props: HeaderProps) => {
  const router = useRouter();
  const isDark = useIsDarkMode();

  const viewMembersList = useCallback(() => {
    const as = `/channels/${props.channelId}/members`;

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            channelsMembersModal: true,
          },
        } as any,
      }),
      Platform.select({
        native: as,
        web: router.asPath,
      }),
      { shallow: true }
    );
  }, [props.channelId, router]);

  return (
    <View
      tw="web:pt-2 web:md:py-5 android:pt-4 flex-row items-center px-4 pb-2"
      style={{ columnGap: 8 }}
    >
      <View tw="flex-row items-center" style={{ columnGap: 8 }}>
        <Pressable
          onPress={() => {
            router.back();
          }}
          tw="md:hidden"
        >
          <ArrowLeft
            height={24}
            width={24}
            color={isDark ? "white" : "black"}
          />
        </Pressable>
        <View>
          <AvatarHoverCard
            username={props.username}
            url={props.picture}
            size={34}
            alt="Channels Avatar"
          />
        </View>
      </View>
      <View tw="flex-1" style={{ rowGap: 8 }}>
        <Text
          onPress={() => router.push(`/@${props.username}`)}
          tw="text-sm font-bold text-gray-900 dark:text-gray-100"
        >
          {props.title ?? "Loading..."}
        </Text>
        <Text
          onPress={viewMembersList}
          tw="text-xs text-gray-900 dark:text-gray-100"
        >
          {props.members ?? 0} members
        </Text>
      </View>
      <View tw="flex-row">
        <Pressable onPress={props.onPressShare} tw="p-2 md:hidden">
          <Share
            height={20}
            width={20}
            color={isDark ? colors.gray["100"] : colors.gray[800]}
          />
        </Pressable>
        {!props.isCurrentUserOwner ? (
          <Pressable onPress={props.onPressSettings} tw="p-2 md:hidden">
            <Settings
              height={20}
              width={20}
              color={isDark ? colors.gray["100"] : colors.gray[800]}
            />
          </Pressable>
        ) : null}

        <Pressable onPress={props.onPressShare} tw="hidden md:flex">
          <Share
            height={24}
            width={24}
            color={isDark ? colors.gray["100"] : colors.gray[800]}
          />
        </Pressable>
        {!props.isCurrentUserOwner ? (
          <Pressable onPress={props.onPressSettings} tw="ml-4 hidden md:flex">
            <MoreHorizontal
              height={24}
              width={24}
              color={isDark ? colors.gray["100"] : colors.gray[800]}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};
type Query = {
  channelId: string;
};
const { useParam } = createParam<Query>();
const benefits = [
  {
    icon: Music,
    text: "Music releases and shows",
  },
  {
    icon: GiftV2,
    text: "NFT drops & allowlists",
  },
  {
    icon: Shopping,
    text: "Merchandise links & discounts",
  },
  {
    icon: LockRounded,
    text: "Unreleased content or news",
  },
];

const keyExtractor = (item: ChannelMessageItem) =>
  item.channel_message.id.toString();

export const Messages = () => {
  const listRef = useRef<FlashList<any>>(null);
  const [channelId] = useParam("channelId");
  const [showIntro, setShowIntro] = useState(true);
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const bottomHeight = usePlatformBottomHeight();
  const [editMessage, setEditMessage] = useState<
    undefined | { id: number; text: string }
  >();
  const router = useRouter();
  const share = useShare();
  const isDark = useIsDarkMode();
  const user = useUser();
  const windowDimension = useWindowDimensions();
  const redirectToChannelCongrats = useRedirectToChannelCongrats();
  const isUserAdmin =
    user.user?.data.channels &&
    user.user?.data.channels[0] === Number(channelId);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const editMessageIdSharedValue = useSharedValue<undefined | number>(
    undefined
  );
  const keyboard =
    Platform.OS !== "web"
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useAnimatedKeyboard()
      : { height: { value: 0 }, state: {} };

  const editMessageItemDimension = useSharedValue({ pageY: 0, height: 0 });

  useEffect(() => {
    editMessageIdSharedValue.value = editMessage?.id;
    if (!editMessage) {
      editMessageItemDimension.value = { pageY: 0, height: 0 };
    }
  }, [editMessage, editMessageIdSharedValue, editMessageItemDimension]);

  const scrollhandler = useAnimatedScrollHandler({
    onEndDrag: (event) => {
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
    },
  });

  const channelDetail = useChannelById(channelId);
  const membersCount = channelDetail.data?.member_count || 0;

  useIntroducingCreatorChannels();

  useEffect(() => {
    AvoidSoftInput.setEnabled(false);

    return () => {
      AvoidSoftInput.setEnabled(true);
    };
  }, []);

  const shareLink = async () => {
    const result = await share({
      url: `${getWebBaseURL()}/channels/${channelId}`,
    });
    if (result.action === "sharedAction") {
      Analytics.track(
        EVENTS.USER_SHARED_PROFILE,
        result.activityType ? { type: result.activityType } : undefined
      );
    }
  };
  const { data, isLoading, fetchMore, isLoadingMore, error } =
    useChannelMessages(channelId);
  const isCurrentUserOwner =
    channelDetail.data?.owner.profile_id === user.user?.data.profile.profile_id;
  const onLoadMore = async () => {
    fetchMore();
  };

  /* HIRBOD: PLEASE KEEP FOR NOW
  const {
    configureAnimationOnNextFrame,
    CellRendererComponent,
    animationIsRunning,
  } = useAnimatedInsert({
    flashList: listRef,
    data: data as any,
    animationDuration: 1000,
  });
  */

  useEffect(() => {
    if (error && axios.isAxiosError(error)) {
      if (error?.response?.status === 404 || error?.response?.status === 401) {
        router.replace("/channels");
      }
    }
  }, [error, router]);

  const renderItem: ListRenderItem<ChannelMessageItem> = useCallback(
    ({ item, extraData }) => {
      return (
        <MessageItem
          item={item}
          reactions={extraData.reactions}
          channelId={extraData.channelId}
          listRef={listRef}
          setEditMessage={setEditMessage}
          editMessageIdSharedValue={editMessageIdSharedValue}
          editMessageItemDimension={editMessageItemDimension}
        />
      );
    },
    [editMessageIdSharedValue, editMessageItemDimension]
  );

  const style = useAnimatedStyle(() => {
    // Bring edit message to the center of the screen
    if (
      editMessageItemDimension.value.height &&
      editMessageItemDimension.value.pageY < windowDimension.height / 2
    ) {
      return {};
    } else {
      return {
        transform: [
          {
            translateY: -keyboard.height.value,
          },
        ],
      };
    }
  }, [keyboard]);

  const listEmptyComponent = useCallback(() => {
    const iconColor = isDark ? colors.white : colors.gray[900];
    return (
      <View
        tw="ios:scale-y-[-1] android:scale-y-[-1] w-full items-center justify-center"
        style={
          Platform.OS !== "web"
            ? { height: windowDimension.height }
            : { height: "100%" }
        }
      >
        <View tw="mt-6 w-full items-center justify-center">
          <AnimatePresence exitBeforeEnter>
            <MotiView
              from={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              exitTransition={{
                type: "timing",
                duration: 600,
              }}
            >
              {isUserAdmin && showIntro && (
                <View tw="w-full max-w-[357px] rounded-2xl bg-gray-100 px-4 pb-6 pt-4 dark:bg-gray-900">
                  <View tw="px-6 pt-1">
                    <Text tw="text-sm font-bold text-black dark:text-white">
                      Welcome! Now send your first update.
                    </Text>
                    <View tw="h-2" />
                    <Text tw="text-sm text-gray-900 dark:text-white">
                      All your collectors will join automatically after your
                      first update. We recommend at least 2 updates a week on:
                    </Text>
                    {benefits.map((item, i) => (
                      <View tw="mt-2 flex-row items-center" key={i.toString()}>
                        {item.icon({ width: 20, height: 20, color: iconColor })}
                        <Text tw="ml-3 text-sm font-semibold text-black dark:text-white">
                          {item.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </MotiView>
          </AnimatePresence>
        </View>
        {isUserAdmin && (
          <View tw="absolute bottom-4 mt-auto w-full items-center justify-center">
            <View tw="my-3 max-w-[300px] flex-row items-start justify-start">
              <View tw="absolute -top-1.5">
                <EyeOffV2
                  width={18}
                  height={18}
                  color={isDark ? colors.gray[200] : colors.gray[600]}
                />
              </View>
              <Text tw="ml-6 text-center text-xs text-gray-600 dark:text-gray-400">
                This channel is not visible to your followers until you post an
                update.
              </Text>
            </View>
            <Text tw="pt-4 text-center text-xs text-indigo-700 dark:text-violet-400">{`${membersCount.toLocaleString()} members will be notified`}</Text>
          </View>
        )}
      </View>
    );
  }, [isDark, isUserAdmin, membersCount, showIntro, windowDimension.height]);

  const extraData = useMemo(
    () => ({ reactions: channelDetail.data?.channel_reactions, channelId }),
    [channelDetail.data?.channel_reactions, channelId]
  );
  const sendMessageCallback = useCallback(() => {
    if (data?.length !== 0) return;
    redirectToChannelCongrats(channelId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length, channelId]);

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
          <Text
            tw="text-center text-gray-900 dark:text-white"
            style={{ fontSize: 26 }}
          >
            No channel joined.
          </Text>
          <View tw="h-5" />
          <Text tw="text-center text-2xl font-bold text-gray-900 dark:text-white">
            To join a channel, browse popular creators or collect a drop.
          </Text>
        </View>
      </View>
    );
  }

  if (isLoading || channelDetail.isLoading) {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
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
        <Header
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
        <View
          tw={[
            "flex-1 overflow-hidden",
            isUserAdmin ? "android:pb-12 ios:pb-8 web:pb-12" : "",
          ]}
        >
          <AnimatedInfiniteScrollListWithRef
            ref={listRef}
            keyExtractor={keyExtractor}
            data={data}
            onEndReached={onLoadMore}
            inverted
            onScroll={scrollhandler}
            drawDistance={height * 2}
            useWindowScroll={false}
            estimatedItemSize={100}
            estimatedListSize={{
              width,
              height,
            }}
            keyboardDismissMode="on-drag"
            renderItem={renderItem}
            contentContainerStyle={{ paddingTop: insets.bottom }}
            style={style}
            extraData={extraData}
            CellRendererComponent={CustomCellRenderer}
            ListEmptyComponent={listEmptyComponent}
            ListFooterComponent={
              isLoadingMore
                ? () => (
                    <View tw="w-full items-center py-4">
                      <Spinner size="small" />
                    </View>
                  )
                : () => null
            }
          />
        </View>
        {isUserAdmin ? (
          <MessageInput
            listRef={listRef}
            channelId={channelId}
            sendMessageCallback={sendMessageCallback}
            setEditMessage={setEditMessage}
            editMessage={editMessage}
          />
        ) : null}
        {showScrollToBottom ? (
          <Animated.View entering={SlideInDown} exiting={SlideOutDown}>
            <View tw="absolute bottom-[80px] right-4">
              <ScrollToBottomButton
                onPress={() => {
                  listRef.current?.scrollToOffset({
                    offset: 0,
                    animated: true,
                  });
                }}
              />
            </View>
          </Animated.View>
        ) : null}
      </View>
    </>
  );
};

const MessageInput = ({
  listRef,
  channelId,
  sendMessageCallback,
  editMessage,
  setEditMessage,
}: {
  listRef: RefObject<FlashList<any>>;
  channelId: string;
  sendMessageCallback?: () => void;
  editMessage?: undefined | { id: number; text: string };
  setEditMessage: (v: undefined | { id: number; text: string }) => void;
}) => {
  const keyboard =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    Platform.OS !== "web" ? useAnimatedKeyboard() : { height: { value: 0 } };

  const bottomHeight = usePlatformBottomHeight();
  const sendMessage = useSendChannelMessage(channelId);
  const inputRef = useRef<any>(null);
  const editMessages = useEditChannelMessage(channelId);
  const isDark = useIsDarkMode();
  const bottom = Platform.select({ web: bottomHeight, ios: 16, android: 0 });

  const style = useAnimatedStyle(() => {
    return {
      paddingBottom: bottom,
      bottom: 0,
      backgroundColor: isDark ? "black" : "white",
      transform: [
        {
          translateY: -keyboard.height.value,
        },
      ],
    };
  }, [keyboard, bottom]);

  useEffect(() => {
    if (editMessage) {
      inputRef.current?.setValue(editMessage.text);
      inputRef.current?.focus();
    } else {
      inputRef.current?.setValue("");
    }
  }, [editMessage]);

  return (
    <Animated.View style={[{ position: "absolute", width: "100%" }, style]}>
      <MessageBox
        ref={inputRef}
        placeholder="Send an update..."
        onSubmit={async (text: string) => {
          if (channelId) {
            listRef.current?.prepareForLayoutAnimationRender();
            await sendMessage.trigger({
              channelId,
              message: text,
              callback: sendMessageCallback,
            });
            inputRef.current?.reset();
          }

          return Promise.resolve();
        }}
        submitting={sendMessage.isMutating}
        tw="bg-white dark:bg-black"
        submitButton={
          editMessage ? (
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <View tw="flex-row" style={{ gap: 8 }}>
                <Button
                  variant="secondary"
                  style={{ backgroundColor: colors.red[500] }}
                  iconOnly
                  onPress={() => {
                    setEditMessage(undefined);
                    inputRef.current?.reset();
                  }}
                >
                  <Close width={20} height={20} color="white" />
                </Button>
                <Button
                  disabled={editMessages.isMutating || !editMessage}
                  iconOnly
                  onPress={() => {
                    editMessages.trigger({
                      messageId: editMessage.id,
                      message: inputRef.current.value,
                      channelId,
                    });
                    setEditMessage(undefined);
                    inputRef.current?.reset();
                  }}
                >
                  <Check width={20} height={20} />
                </Button>
              </View>
            </Animated.View>
          ) : null
        }
      />
    </Animated.View>
  );
};

const MessageItem = memo(
  ({
    item,
    reactions,
    channelId,
    listRef,
    setEditMessage,
    editMessageIdSharedValue,
    editMessageItemDimension,
  }: MessageItemProps & {
    listRef: RefObject<FlashList<any>>;
    editMessageIdSharedValue: Animated.SharedValue<number | undefined>;
    editMessageItemDimension: Animated.SharedValue<{
      height: number;
      pageY: number;
    }>;
  }) => {
    const { channel_message } = item;
    const reactOnMessage = useReactOnMessage(channelId);
    const deleteMessage = useDeleteMessage(channelId);
    const Alert = useAlert();
    const isDark = useIsDarkMode();
    const user = useUser();
    const animatedViewRef = useAnimatedRef<any>();
    const router = useRouter();
    const linkifiedMessage = useMemo(
      () =>
        channel_message.body
          ? linkifyDescription(
              limitLineBreaks(
                cleanUserTextInput(removeTags(channel_message.body)),
                10
              )
            )
          : "",
      [channel_message.body]
    );

    const style = useAnimatedStyle(() => {
      if (editMessageIdSharedValue.value === channel_message.id) {
        return {
          backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
          borderRadius: 8,
        };
      }
      return {
        backgroundColor: "transparent",
        borderRadius: 0,
      };
    }, [isDark, editMessageIdSharedValue.value, channel_message.id]);

    return (
      <Animated.View style={style} ref={animatedViewRef}>
        <View tw="my-2 px-4">
          <View tw="flex-row" style={{ columnGap: 8 }}>
            <Link
              href={`/@${
                item.channel_message.sent_by.profile.username ??
                item.channel_message.sent_by.profile.wallet_addresses
              }`}
            >
              <View tw="h-6 w-6">
                <Avatar
                  size={24}
                  url={channel_message.sent_by.profile.img_url}
                />
                <View tw="absolute h-full w-full rounded-full border-[1.4px] border-white/60 dark:border-black/60" />
              </View>
            </Link>
            <View tw="flex-1" style={{ rowGap: 8 }}>
              <View tw="flex-row items-center" style={{ columnGap: 8 }}>
                <Link
                  href={`/@${
                    item.channel_message.sent_by.profile.username ??
                    item.channel_message.sent_by.profile.wallet_addresses
                  }`}
                >
                  <Text tw="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {channel_message.sent_by.profile.name}
                  </Text>
                </Link>

                <Text tw="text-xs text-gray-700 dark:text-gray-200">
                  {formatDateRelativeWithIntl(channel_message.updated_at)}
                </Text>

                <View
                  tw="mr-2 flex-1 flex-row items-center justify-end"
                  style={{ gap: 16 }}
                >
                  <Reaction
                    reactions={reactions}
                    reactionGroup={item.reaction_group}
                    onPress={async (id) => {
                      listRef.current?.prepareForLayoutAnimationRender();
                      await reactOnMessage.trigger({
                        messageId: item.channel_message.id,
                        reactionId: id,
                      });
                    }}
                  />
                  <View>
                    <DropdownMenuRoot>
                      <DropdownMenuTrigger>
                        <MoreHorizontal
                          color={isDark ? colors.gray[400] : colors.gray[700]}
                          width={20}
                          height={20}
                        />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent loop sideOffset={8}>
                        {item.channel_message.sent_by.profile.profile_id ===
                        user.user?.data.profile.profile_id ? (
                          <DropdownMenuItem
                            onSelect={() => {
                              Alert.alert(
                                "Are you sure you want to delete this message?",
                                "",
                                [
                                  {
                                    text: "Cancel",
                                  },
                                  {
                                    text: "Delete",
                                    style: "destructive",
                                    onPress: () => {
                                      listRef.current?.prepareForLayoutAnimationRender();
                                      deleteMessage.trigger({
                                        messageId: item.channel_message.id,
                                      });
                                    },
                                  },
                                ]
                              );
                            }}
                            key="delete"
                          >
                            <MenuItemIcon
                              Icon={Trash}
                              ios={{
                                paletteColors: ["red"],
                                name: "trash",
                              }}
                            />
                            <DropdownMenuItemTitle tw="font-semibold text-red-500">
                              Delete
                            </DropdownMenuItemTitle>
                          </DropdownMenuItem>
                        ) : null}

                        {item.channel_message.sent_by.profile.profile_id ===
                        user.user?.data.profile.profile_id ? (
                          <DropdownMenuItem
                            onSelect={() => {
                              runOnUI(() => {
                                "worklet";
                                const values = measure(animatedViewRef);
                                if (values) {
                                  editMessageItemDimension.value = {
                                    height: values.height,
                                    pageY: values.pageY,
                                  };
                                }
                                runOnJS(setEditMessage)({
                                  text: item.channel_message.body,
                                  id: item.channel_message.id,
                                });
                              })();
                            }}
                            key="edit"
                          >
                            <MenuItemIcon
                              Icon={Edit}
                              ios={{
                                name: "pencil",
                              }}
                            />
                            <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-gray-400">
                              Edit
                            </DropdownMenuItemTitle>
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem
                          onSelect={() => {
                            router.push(
                              {
                                pathname:
                                  Platform.OS === "web"
                                    ? router.pathname
                                    : "/report",
                                query: {
                                  ...router.query,
                                  reportModal: true,
                                  channelMessageId: item.channel_message.id,
                                },
                              },
                              Platform.OS === "web" ? router.asPath : undefined
                            );
                          }}
                          key="report"
                        >
                          <MenuItemIcon
                            Icon={Flag}
                            ios={{
                              name: "flag",
                            }}
                          />
                          <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-gray-400">
                            Report
                          </DropdownMenuItemTitle>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenuRoot>
                  </View>
                </View>
              </View>

              <Text selectable tw="text-sm text-gray-900 dark:text-gray-100">
                {linkifiedMessage}
              </Text>
              <PlatformAnimateHeight
                initialHeight={item.reaction_group.length > 0 ? 30 : 0}
              >
                {item.reaction_group.length > 0 ? (
                  <AnimatedView tw="pt-1" layout={Layout}>
                    <MessageReactions
                      reactionGroup={item.reaction_group}
                      channelId={channelId}
                      channelReactions={reactions}
                      messageId={channel_message.id}
                    />
                  </AnimatedView>
                ) : null}
              </PlatformAnimateHeight>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }
);

MessageItem.displayName = "MessageItem";
