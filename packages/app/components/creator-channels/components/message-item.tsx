import { memo, useMemo, RefObject } from "react";
import { Platform } from "react-native";

import Animated, {
  useAnimatedStyle,
  runOnJS,
  runOnUI,
  measure,
  useAnimatedRef,
  Layout,
  enableLayoutAnimations,
} from "react-native-reanimated";

import { AnimateHeight } from "@showtime-xyz/universal.accordion";
import { useAlert } from "@showtime-xyz/universal.alert";
import { Avatar } from "@showtime-xyz/universal.avatar";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Edit, Trash, Flag } from "@showtime-xyz/universal.icon";
import { MoreHorizontal } from "@showtime-xyz/universal.icon";
import { FlashList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ClaimPaidNFTButton } from "app/components/claim/claim-paid-nft-button";
import { Reaction } from "app/components/reaction";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useUser } from "app/hooks/use-user";
import { linkifyDescription } from "app/lib/linkify";
import { Link } from "app/navigation/link";
import {
  cleanUserTextInput,
  formatDateRelativeWithIntl,
  isMobileWeb,
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

import { MenuItemIcon } from "../../dropdown/menu-item-icon";
import { MessageReactions } from "../../reaction/message-reactions";
import { useDeleteMessage } from "../hooks/use-delete-message";
import { useReactOnMessage } from "../hooks/use-react-on-message";
import { MessageItemProps } from "../types";
import { MessageItemDropdown } from "./message-item-dropdown";
import { StarDropBadge } from "./star-drop-badge";

const PlatformAnimateHeight = Platform.OS === "web" ? AnimateHeight : View;
const AnimatedView = Animated.createAnimatedComponent(View);

export const MessageItem = memo(
  ({
    item,
    reactions,
    channelId,
    listRef,
    setEditMessage,
    editMessageIdSharedValue,
    editMessageItemDimension,
    edition,
  }: MessageItemProps & {
    edition?: CreatorEditionResponse;
    listRef: RefObject<FlashList<any>>;
    editMessageIdSharedValue: Animated.SharedValue<number | undefined>;
    editMessageItemDimension: Animated.SharedValue<{
      height: number;
      pageY: number;
    }>;
  }) => {
    const { channel_message } = item;
    const reactOnMessage = useReactOnMessage(channelId);
    const isDark = useIsDarkMode();
    const animatedViewRef = useAnimatedRef<any>();
    const linkifiedMessage = useMemo(
      () =>
        channel_message.body
          ? linkifyDescription(
              limitLineBreaks(
                cleanUserTextInput(removeTags(channel_message.body)),
                10
              ),
              "!text-indigo-600 dark:!text-blue-400"
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

    // check if message was edited
    const messageWasEdited = useMemo(() => {
      const createdTime = new Date(channel_message.created_at);
      const updatedTime = new Date(channel_message.updated_at);

      const timeDifference = updatedTime.getTime() - createdTime.getTime(); // Time difference in milliseconds

      const minimumDuration = 2000; // 2 seconds in milliseconds

      if (timeDifference >= minimumDuration) return true;

      return false;
    }, [channel_message.created_at, channel_message.updated_at]);

    const isStarDrop = channel_message.is_payment_gated;
    const isUnlockedStarDrop = isStarDrop && channel_message.body;

    if (isStarDrop && !isUnlockedStarDrop && edition) {
      // StarDrop but not unlocked
      return <ClaimPaidNFTButton edition={edition} type="messageItem" />;
    }

    return (
      <AnimatedView tw="my-2 px-3" style={style} ref={animatedViewRef}>
        <View tw="flex-row" style={{ columnGap: 8 }}>
          <Link
            href={`/@${
              item.channel_message.sent_by.profile.username ??
              item.channel_message.sent_by.profile.wallet_addresses
            }`}
          >
            <View tw="h-6 w-6">
              <Avatar size={24} url={channel_message.sent_by.profile.img_url} />
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
                <Text
                  tw={["text-sm font-bold text-gray-900 dark:text-gray-100"]}
                >
                  {channel_message.sent_by.profile.name}
                </Text>
              </Link>

              <View tw="flex-row items-center">
                <Text tw={["text-xs text-gray-700 dark:text-gray-200"]}>
                  {formatDateRelativeWithIntl(
                    channel_message.created_at,
                    Platform.OS === "web" && !isMobileWeb()
                  )}
                </Text>
                {isStarDrop ? (
                  <View tw="ml-2">
                    <StarDropBadge />
                  </View>
                ) : null}
              </View>

              <View
                tw="mr-2 flex-1 flex-row items-center justify-end"
                style={{ gap: 8 }}
              >
                <Reaction
                  reactions={reactions}
                  reactionGroup={item.reaction_group}
                  onPress={(id) => {
                    enableLayoutAnimations(true);
                    requestAnimationFrame(async () => {
                      await reactOnMessage.trigger({
                        messageId: item.channel_message.id,
                        reactionId: id,
                      });
                      requestAnimationFrame(() => {
                        enableLayoutAnimations(false);
                      });
                    });
                  }}
                />
                <MessageItemDropdown
                  item={item}
                  reactions={reactions}
                  channelId={channelId}
                  setEditMessage={setEditMessage}
                  listRef={listRef}
                  editMessageItemDimension={editMessageItemDimension}
                />
              </View>
            </View>

            <Text>
              <Text
                selectable
                tw={["text-sm text-gray-900 dark:text-gray-100"]}
                style={
                  Platform.OS === "web"
                    ? {
                        // @ts-ignore
                        wordBreak: "break-word",
                      }
                    : {}
                }
              >
                {linkifiedMessage}
              </Text>
              {messageWasEdited && (
                <Text tw="text-xs text-gray-500 dark:text-gray-200" selectable>
                  {` • edited`}
                </Text>
              )}
            </Text>
            <PlatformAnimateHeight
              initialHeight={item.reaction_group.length > 0 ? 29 : 0}
            >
              {item.reaction_group.length > 0 ? (
                <AnimatedView tw="pt-1" layout={Layout}>
                  <MessageReactions
                    key={channel_message.id}
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
      </AnimatedView>
    );
  }
);
MessageItem.displayName = "MessageItem";

export const MessageItemBySelf = memo(
  ({
    item,
    reactions,
    channelId,
    listRef,
    setEditMessage,
    editMessageItemDimension,
    edition,
  }: MessageItemProps & {
    edition?: CreatorEditionResponse;
    listRef: RefObject<FlashList<any>>;
    editMessageIdSharedValue: Animated.SharedValue<number | undefined>;
    editMessageItemDimension: Animated.SharedValue<{
      height: number;
      pageY: number;
    }>;
  }) => {
    const { channel_message } = item;
    const reactOnMessage = useReactOnMessage(channelId);
    const user = useUser();
    const animatedViewRef = useAnimatedRef<any>();
    const linkifiedMessage = useMemo(
      () =>
        channel_message.body
          ? linkifyDescription(
              limitLineBreaks(
                cleanUserTextInput(removeTags(channel_message.body)),
                10
              ),
              "!text-indigo-600 dark:!text-blue-400"
            )
          : "",
      [channel_message.body]
    );

    const messageWasEdited = useMemo(() => {
      const createdTime = new Date(channel_message.created_at);
      const updatedTime = new Date(channel_message.updated_at);

      const timeDifference = updatedTime.getTime() - createdTime.getTime(); // Time difference in milliseconds

      const minimumDuration = 2000; // 2 seconds in milliseconds

      if (timeDifference >= minimumDuration) return true;

      return false;
    }, [channel_message.created_at, channel_message.updated_at]);

    const isStarDrop = channel_message.is_payment_gated;
    const isUnlockedStarDrop = isStarDrop && channel_message.body;

    if (isStarDrop && !isUnlockedStarDrop && edition) {
      // StarDrop but not unlocked
      return <ClaimPaidNFTButton edition={edition} type="messageItem" />;
    }

    return (
      <AnimatedView tw="my-2" ref={animatedViewRef}>
        <View
          tw="mb-2 mr-2 self-end rounded-bl-3xl rounded-br rounded-tl-2xl rounded-tr-3xl bg-indigo-200/80 px-3 pb-4 pt-6 dark:bg-indigo-500/80"
          style={{
            maxWidth: "80%",
            minWidth: 70,
          }}
        >
          <Text tw="self-end">
            <Text
              selectable
              tw={["text-sm text-gray-900 dark:text-gray-100"]}
              style={
                Platform.OS === "web"
                  ? {
                      // @ts-ignore
                      wordBreak: "break-word",
                    }
                  : {}
              }
            >
              {linkifiedMessage}
            </Text>
            {messageWasEdited && (
              <Text tw="text-xs text-gray-500 dark:text-gray-200" selectable>
                {` • edited`}
              </Text>
            )}
          </Text>
        </View>
        <View
          tw="absolute right-5 top-1 flex-row items-center justify-end"
          style={{ gap: 8 }}
        >
          <Reaction
            reactions={reactions}
            reactionGroup={item.reaction_group}
            onPress={(id) => {
              enableLayoutAnimations(true);
              requestAnimationFrame(async () => {
                await reactOnMessage.trigger({
                  messageId: item.channel_message.id,
                  reactionId: id,
                });
                requestAnimationFrame(() => {
                  enableLayoutAnimations(false);
                });
              });
            }}
          />
          <MessageItemDropdown
            item={item}
            reactions={reactions}
            channelId={channelId}
            setEditMessage={setEditMessage}
            listRef={listRef}
            editMessageItemDimension={editMessageItemDimension}
          />
        </View>

        <View tw="flex-row items-center self-end">
          <PlatformAnimateHeight
            initialHeight={item.reaction_group.length > 0 ? 29 : 0}
          >
            {item.reaction_group.length > 0 ? (
              <AnimatedView layout={Layout}>
                <MessageReactions
                  key={channel_message.id}
                  reactionGroup={item.reaction_group}
                  channelId={channelId}
                  channelReactions={reactions}
                  messageId={channel_message.id}
                  tw="flex-none"
                  style={{ width: "auto" }}
                />
              </AnimatedView>
            ) : null}
          </PlatformAnimateHeight>
          <View tw="ml-2 mr-4 mt-1 flex-row items-center justify-end">
            <Text tw={["text-xs text-gray-700 dark:text-gray-200"]}>
              {formatDateRelativeWithIntl(channel_message.created_at)}
            </Text>
          </View>
        </View>
      </AnimatedView>
    );
  }
);
MessageItemBySelf.displayName = "MessageItemBySelf";

export const MessageSkeleton = () => {
  return (
    <View tw="web:pb-4 h-full w-full flex-1 pb-14">
      <View tw="h-full flex-1 justify-end px-4">
        {new Array(8).fill(0).map((_, i) => {
          return (
            <View tw="flex-row pt-4" key={`${i}`}>
              <View tw="mr-2 overflow-hidden rounded-full">
                <Skeleton width={28} height={28} show />
              </View>
              <View>
                <Skeleton width={140} height={10} show />
                <View tw="h-1" />
                <Skeleton width={90} height={10} show />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
