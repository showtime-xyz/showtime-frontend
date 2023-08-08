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

import { Reaction } from "app/components/reaction";
import { useUser } from "app/hooks/use-user";
import { linkifyDescription } from "app/lib/linkify";
import { Link } from "app/navigation/link";
import {
  cleanUserTextInput,
  formatDateRelativeWithIntl,
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
import { GatedMessage, StarDropBadge } from "./gated-message";

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
    latestNFTSlug,
  }: MessageItemProps & {
    latestNFTSlug?: string;
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

    // flag to allow message editing, if message is not older than 2 hours
    const allowMessageEditing = useMemo(() => {
      const createdTime = new Date(channel_message.created_at);
      const currentTime = new Date();

      const timeDifference = currentTime.getTime() - createdTime.getTime(); // Time difference in milliseconds

      const maximumDuration = 7200000; // 2 hours in milliseconds

      if (timeDifference <= maximumDuration) return true;

      return false;
    }, [channel_message.created_at]);

    const isStarDrop = channel_message.is_payment_gated;
    const isUnlockedStarDrop = isStarDrop && channel_message.body;

    if (isStarDrop && !isUnlockedStarDrop) {
      // StarDrop but not unlocked
      return <GatedMessage latestNFT={latestNFTSlug} />;
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
                  {formatDateRelativeWithIntl(channel_message.created_at)}
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
                <View>
                  <DropdownMenuRoot>
                    <DropdownMenuTrigger
                      // @ts-expect-error - RNW
                      style={Platform.select({
                        web: {
                          cursor: "pointer",
                        },
                      })}
                    >
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
                                    enableLayoutAnimations(true);
                                    requestAnimationFrame(async () => {
                                      listRef.current?.prepareForLayoutAnimationRender();
                                      await deleteMessage.trigger({
                                        messageId: item.channel_message.id,
                                      });
                                      requestAnimationFrame(() => {
                                        enableLayoutAnimations(false);
                                      });
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

                      {
                        // edit message only if message is not older than 2 hours and it belongs to the user
                        item.channel_message.sent_by.profile.profile_id ===
                          user.user?.data.profile.profile_id &&
                        allowMessageEditing ? (
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
                        ) : null
                      }
                      {item.channel_message.sent_by.profile.profile_id !==
                      user.user?.data.profile.profile_id ? (
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
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenuRoot>
                </View>
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
