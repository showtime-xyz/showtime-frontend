import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";

import { AvoidSoftInput } from "react-native-avoid-softinput";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ArrowLeft, Settings, Share } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import Spinner from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { MessageBox } from "app/components/messages";
import { Reaction } from "app/components/reaction";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { createParam } from "app/navigation/use-param";
import { formatDateRelativeWithIntl } from "app/utilities";

import { EmptyPlaceholder } from "../empty-placeholder";
import { MessageReactions } from "../reaction/message-reactions";
import { useChannelMessages } from "./hooks/use-channel-messages";

const AnimatedInfiniteScrollList =
  Animated.createAnimatedComponent(InfiniteScrollList);
type HeaderProps = {
  username: string;
  members: number;
  channelId: string;
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
      tw="web:pt-5 android:pt-4 flex-row items-center px-4 pb-2"
      style={{ columnGap: 8 }}
    >
      <View
        tw="web:pl-10 web:md:pl-0 flex-row items-center"
        style={{ columnGap: 8 }}
      >
        <Pressable
          onPress={() => {
            router.back();
          }}
          tw="web:hidden"
        >
          <ArrowLeft
            height={24}
            width={24}
            color={isDark ? "white" : "black"}
          />
        </Pressable>
        <Avatar size={34} />
      </View>
      <View tw="flex-1" style={{ rowGap: 8 }}>
        <Text tw="text-sm font-bold text-gray-900 dark:text-gray-100">
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
        <Pressable tw="p-2">
          <Share
            height={20}
            width={20}
            color={isDark ? colors.gray["100"] : colors.gray[800]}
          />
        </Pressable>
        <Pressable tw="p-2">
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

export const Messages = () => {
  const [channelId] = useParam("channelId");

  const insets = useSafeAreaInsets();
  const bottomHeight = usePlatformBottomHeight();

  const { data, isLoading, fetchMore, isLoadingMore } = useChannelMessages();
  const keyboard = useAnimatedKeyboard();

  const onLoadMore = () => {
    fetchMore();
  };

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -keyboard.height.value,
        },
      ],
    };
  });
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
      tw="animate-fade-in-250 w-full flex-1"
      style={{
        paddingTop: insets.top,
        paddingBottom:
          bottomHeight +
          32 +
          Platform.select({
            web: 4,
            default: 10,
          }),
      }}
    >
      <Header username="nishan" members={29} channelId={channelId} />
      <View tw="overflow-hidden">
        <AnimatedInfiniteScrollList
          data={data}
          onEndReached={onLoadMore}
          inverted
          useWindowScroll={false}
          estimatedItemSize={20}
          keyboardDismissMode="on-drag"
          renderItem={MessageItem}
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
        />
      </View>
      <MessageInput />
    </View>
  );
};

const MessageInput = () => {
  const keyboard = useAnimatedKeyboard();
  const insets = useSafeAreaInsets();
  useEffect(() => {
    AvoidSoftInput.setEnabled(false);

    return () => {
      AvoidSoftInput.setEnabled(true);
    };
  }, []);

  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      bottom: insets.bottom + 16,
      width: "100%",
      backgroundColor: "white",
      transform: [
        {
          translateY: -keyboard.height.value + 32,
        },
      ],
    };
  });

  return (
    <Animated.View style={style}>
      <MessageBox
        placeholder="Send an update..."
        onSubmit={(text: string) => {
          return Promise.resolve();
        }}
        submitting={false}
      />
    </Animated.View>
  );
};
type MessageItemProps = {
  item: {
    username: string;
    text: string;
  };
};

const MessageItem = (props: MessageItemProps) => {
  const { username, text } = props.item;
  return (
    <View tw="mb-5 px-4">
      <View tw="flex-row" style={{ columnGap: 8 }}>
        <Avatar size={24} />
        <View tw="flex-1" style={{ rowGap: 8 }}>
          <View tw="flex-row items-baseline" style={{ columnGap: 8 }}>
            <Text tw="text-sm font-bold text-gray-900 dark:text-gray-100">
              {username}
            </Text>
            <Text tw="text-xs text-gray-700 dark:text-gray-200">
              {formatDateRelativeWithIntl(new Date().toISOString())}
            </Text>
          </View>

          <Text selectable tw="text-sm text-gray-900 dark:text-gray-100">
            {text}
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
};
