import { useCallback, useEffect, memo, useState } from "react";
import { Platform } from "react-native";

import { MotiView, AnimatePresence } from "moti";
import { AvoidSoftInput } from "react-native-avoid-softinput";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  ArrowLeft,
  CloseLarge,
  EyeOffV2,
  GiftV2,
  LockRounded,
  Music,
  Settings,
  Share,
  Shopping,
} from "@showtime-xyz/universal.icon";
import {
  InfiniteScrollList,
  InfiniteScrollListProps,
  ListRenderItem,
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
import { Reaction } from "app/components/reaction";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useShare } from "app/hooks/use-share";
import { useUser } from "app/hooks/use-user";
import { Analytics, EVENTS } from "app/lib/analytics";
import { createParam } from "app/navigation/use-param";
import { formatDateRelativeWithIntl, getWebBaseURL } from "app/utilities";

import { EmptyPlaceholder } from "../empty-placeholder";
import { MessageReactions } from "../reaction/message-reactions";
import {
  ChannelMessageItem,
  useChannelMessages,
} from "./hooks/use-channel-messages";
import { useSendChannelMessage } from "./hooks/use-send-channel-message";

type MessageItemProps = {
  item: ChannelMessageItem;
};

type HeaderProps = {
  username: string;
  members: number;
  channelId: string;
  onPressSettings: () => void;
  onPressShare: () => void;
};

const AnimatedInfiniteScrollList =
  Animated.createAnimatedComponent<InfiniteScrollListProps<ChannelMessageItem>>(
    InfiniteScrollList
  );

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
      tw="web:pt-2 android:pt-4 flex-row items-center px-4 pb-2"
      style={{ columnGap: 8 }}
    >
      <View tw="flex-row items-center" style={{ columnGap: 8 }}>
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <ArrowLeft
            height={24}
            width={24}
            color={isDark ? "white" : "black"}
          />
        </Pressable>
        <AvatarHoverCard
          username={props.username}
          url={"https://picsum.photos/200"}
          size={34}
          alt="Channels Avatar"
        />
      </View>
      <View tw="flex-1" style={{ rowGap: 8 }}>
        <Text
          onPress={() => router.push(`/@${props.username}`)}
          tw="text-sm font-bold text-gray-900 dark:text-gray-100"
        >
          {props.username}
        </Text>
        <Text
          onPress={viewMembersList}
          tw="text-xs text-gray-900 dark:text-gray-100"
        >
          {props.members} members
        </Text>
      </View>
      <View tw="flex-row">
        <Pressable onPress={props.onPressShare} tw="p-2">
          <Share
            height={20}
            width={20}
            color={isDark ? colors.gray["100"] : colors.gray[800]}
          />
        </Pressable>
        <Pressable onPress={props.onPressSettings} tw="p-2">
          <Settings
            height={20}
            width={20}
            color={isDark ? colors.gray["100"] : colors.gray[800]}
          />
        </Pressable>
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
export const Messages = () => {
  const [channelId] = useParam("channelId");
  const [showIntro, setShowIntro] = useState(true);
  const insets = useSafeAreaInsets();
  const bottomHeight = usePlatformBottomHeight();
  const router = useRouter();
  const share = useShare();
  const isDark = useIsDarkMode();
  const user = useUser();
  const isUserAdmin =
    user.user?.data.channels &&
    user.user?.data.channels[0] === Number(channelId);

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
  const { data, isLoading, fetchMore, isLoadingMore } =
    useChannelMessages(channelId);
  const keyboard = useAnimatedKeyboard();

  const onLoadMore = () => {
    fetchMore();
  };

  const renderItem: ListRenderItem<ChannelMessageItem> = useCallback(
    ({ item }) => {
      return <MessageItem item={item} />;
    },
    []
  );

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -keyboard.height.value,
        },
      ],
    };
  }, [keyboard]);

  const listEmptyComponent = useCallback(() => {
    const iconColor = isDark ? colors.white : colors.gray[900];
    return (
      <>
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
              {showIntro && (
                <View tw="w-full max-w-[357px] rounded-2xl bg-gray-100 px-4 pb-6 pt-4 dark:bg-gray-900">
                  <Button
                    onPress={() => setShowIntro(false)}
                    iconOnly
                    variant="text"
                  >
                    <CloseLarge width={14} height={14} />
                  </Button>
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
          <View tw="mt-3 max-w-[300px] flex-row items-start justify-start">
            <View tw="absolute -top-1.5">
              <EyeOffV2
                width={18}
                height={18}
                color={isDark ? colors.gray[200] : colors.gray[600]}
              />
            </View>
            <Text tw="ml-6 text-center text-xs text-gray-600 dark:text-gray-500">
              This channel is not visible to your followers until you post an
              update.
              <Text
                tw="ml-1 text-center text-xs text-blue-600"
                onPress={() => setShowIntro(true)}
              >
                Learn more.
              </Text>
            </Text>
          </View>
        </View>
        <View tw="absolute bottom-0.5 w-full items-center justify-center">
          <Text tw="text-center text-xs text-indigo-700 dark:text-violet-400">{`2,300 members will be notified`}</Text>
        </View>
      </>
    );
  }, [isDark, showIntro]);

  if (!channelId) {
    return (
      <EmptyPlaceholder
        tw="animate-fade-in-250 flex-1"
        title="Select a channel."
      />
    );
  }
  if (isLoading) {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  return (
    <View
      tw="animate-fade-in-250 w-full flex-1 bg-white dark:bg-black"
      style={{
        paddingTop: insets.top,
        paddingBottom: Platform.select({
          web: bottomHeight,
        }),
      }}
    >
      <Header
        username="nishanbende"
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
        onPressShare={shareLink}
        members={29}
        channelId={channelId}
      />
      <View tw="web:pb-16 flex-1 overflow-hidden pb-8">
        <AnimatedInfiniteScrollList
          data={data}
          onEndReached={onLoadMore}
          inverted
          useWindowScroll={false}
          estimatedItemSize={100}
          keyboardDismissMode="on-drag"
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: insets.bottom }}
          style={style}
          ListFooterComponent={
            isLoadingMore
              ? () => (
                  <View tw="w-full items-center py-4">
                    <Spinner size="small" />
                  </View>
                )
              : () => null
          }
          ListEmptyComponent={listEmptyComponent}
        />
      </View>
      {isUserAdmin ? <MessageInput channelId={channelId} /> : null}
    </View>
  );
};

const MessageInput = ({ channelId }: { channelId?: string }) => {
  const keyboard = useAnimatedKeyboard();
  const bottomHeight = usePlatformBottomHeight();
  const sendMessage = useSendChannelMessage(channelId);
  const channelMessages = useChannelMessages(channelId);
  useEffect(() => {
    AvoidSoftInput.setEnabled(false);

    return () => {
      AvoidSoftInput.setEnabled(true);
    };
  }, []);

  const bottom = Platform.select({ web: bottomHeight, default: 16 });

  const style = useAnimatedStyle(() => {
    return {
      bottom,
      transform: [
        {
          translateY: -keyboard.height.value,
        },
      ],
    };
  }, [keyboard, bottom]);

  return (
    <Animated.View style={[{ position: "absolute", width: "100%" }, style]}>
      <MessageBox
        placeholder="Send an update..."
        onSubmit={async (text: string) => {
          if (channelId) {
            await sendMessage.trigger({
              channelId,
              message: text,
            });
            channelMessages.mutate();
          }

          return Promise.resolve();
        }}
        submitting={sendMessage.isMutating}
        tw="bg-white dark:bg-black"
      />
    </Animated.View>
  );
};

const MessageItem = memo(({ item }: MessageItemProps) => {
  const { channel_message } = item;
  return (
    <View tw="mb-5 px-4">
      <View tw="flex-row" style={{ columnGap: 8 }}>
        <Avatar size={24} />
        <View tw="flex-1" style={{ rowGap: 8 }}>
          <View tw="flex-row items-baseline" style={{ columnGap: 8 }}>
            <Text tw="text-sm font-bold text-gray-900 dark:text-gray-100">
              {channel_message.sent_by.profile.name}
            </Text>
            <Text tw="text-xs text-gray-700 dark:text-gray-200">
              {formatDateRelativeWithIntl(new Date().toISOString())}
            </Text>
          </View>

          <Text selectable tw="text-sm text-gray-900 dark:text-gray-100">
            {channel_message.body}
          </Text>
          <View tw="mt-1 w-full flex-row items-center">
            <MessageReactions />
            <View tw="mr-2 flex-1 flex-row justify-end">
              <Reaction
                selected={"❤️"}
                onPress={() => {
                  console.log("pressed");
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

MessageItem.displayName = "MessageItem";
