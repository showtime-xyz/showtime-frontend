import { memo, useMemo, RefObject, useContext } from "react";
import { Platform } from "react-native";

import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  runOnJS,
  runOnUI,
  measure,
  useAnimatedRef,
  Layout,
  enableLayoutAnimations,
  SharedValue,
} from "react-native-reanimated";

import { AnimateHeight } from "@showtime-xyz/universal.accordion";
import { useAlert } from "@showtime-xyz/universal.alert";
import { Avatar } from "@showtime-xyz/universal.avatar";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Edit, Trash, Flag } from "@showtime-xyz/universal.icon";
import { MoreHorizontal } from "@showtime-xyz/universal.icon";
import { FlashList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { AudioPlayer } from "app/components/audio-player/audio-player";
import { Reaction } from "app/components/reaction";
import { UserContext } from "app/context/user-context";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
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
import { ChannelById, MessageItemProps } from "../types";
import { generateLoremIpsum } from "../utils";
import { CreatorBadge } from "./creator-badge";
import { ImagePreview } from "./image-preview";
import { LeanText, LeanView } from "./lean-text";

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
    permissions,
    isUserAdmin,
    channelOwnerProfileId,
  }: MessageItemProps & {
    edition?: CreatorEditionResponse;
    isUserAdmin?: boolean;
    permissions?: ChannelById["permissions"];
    listRef: RefObject<FlashList<any>>;
    channelOwnerProfileId?: number;
    editMessageIdSharedValue: SharedValue<number | undefined>;
    editMessageItemDimension: SharedValue<{
      height: number;
      pageY: number;
    }>;
  }) => {
    const { channel_message } = item;
    const reactOnMessage = useReactOnMessage(channelId);
    const deleteMessage = useDeleteMessage(channelId);
    const Alert = useAlert();
    const isDark = useIsDarkMode();
    const user = useContext(UserContext);
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
    }, [isDark, editMessageIdSharedValue, channel_message.id]);

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

    const isByCreator =
      channel_message?.sent_by?.profile.profile_id === channelOwnerProfileId;

    const loremText = useMemo(
      () =>
        item.channel_message.body_text_length > 0
          ? generateLoremIpsum(item.channel_message.body_text_length)
          : "",
      [item.channel_message.body_text_length]
    );

    // TODO: remove and support video
    if (
      item.channel_message?.attachments?.length > 0 &&
      item.channel_message?.attachments[0].mime.includes("video")
    )
      return null;

    return (
      <AnimatedView tw="my-2 px-3" style={style} ref={animatedViewRef}>
        <LeanView tw="flex-row" style={{ columnGap: 8 }}>
          <Link
            href={`/@${
              item.channel_message?.sent_by?.profile.username ??
              item.channel_message?.sent_by?.profile.wallet_addresses ??
              "deleted-user"
            }`}
          >
            <LeanView tw="h-6 w-6">
              <Avatar
                size={24}
                url={channel_message?.sent_by?.profile.img_url}
              />
              <View tw="absolute h-full w-full rounded-full border-[1.4px] border-white/60 dark:border-black/60" />
            </LeanView>
          </Link>
          <LeanView tw="flex-1" style={{ rowGap: 8 }}>
            <LeanView tw="flex-row items-center" style={{ columnGap: 8 }}>
              <Link
                href={`/@${
                  item.channel_message?.sent_by?.profile.username ??
                  item.channel_message?.sent_by?.profile.wallet_addresses ??
                  "deleted-user"
                }`}
              >
                <LeanText
                  tw={"text-sm font-bold text-gray-900 dark:text-gray-100"}
                >
                  {channel_message?.sent_by?.profile.name ?? "Deleted User"}
                </LeanText>
              </Link>

              <LeanView tw="flex-row items-center">
                <LeanText tw={"text-xs text-gray-700 dark:text-gray-200"}>
                  {formatDateRelativeWithIntl(channel_message.created_at)}
                </LeanText>
                {isByCreator ? (
                  <View tw="ml-2">
                    <CreatorBadge />
                  </View>
                ) : null}
              </LeanView>

              <LeanView
                tw="mr-2 flex-1 flex-row items-center justify-end"
                style={{
                  gap: 12,
                  display:
                    isByCreator && !permissions?.can_view_creator_messages
                      ? "none"
                      : undefined,
                }}
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
                    {item.channel_message?.sent_by?.profile.profile_id ===
                      user?.user?.data.profile.profile_id || isUserAdmin ? (
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
                      item.channel_message?.sent_by?.profile.profile_id ===
                        user?.user?.data.profile.profile_id &&
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
                    {item.channel_message?.sent_by?.profile.profile_id !==
                    user?.user?.data.profile.profile_id ? (
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
              </LeanView>
            </LeanView>

            {isByCreator && !permissions?.can_view_creator_messages ? (
              <LeanView tw="-mb-0.5 -ml-2 -mt-0.5 select-none overflow-hidden px-2 py-0.5">
                {Platform.OS === "web" ? (
                  // INFO: I had to do it like that because blur-sm would crash for no reason even with web prefix
                  <LeanView tw="blur-sm">
                    <LeanText tw="text-sm text-gray-900 dark:text-gray-100">
                      {loremText}
                    </LeanText>
                  </LeanView>
                ) : (
                  <>
                    <LeanText tw="py-1.5 text-sm  text-gray-900 dark:text-gray-100">
                      {loremText}
                    </LeanText>
                    <BlurView
                      intensity={10}
                      style={{
                        left: 0,
                        height: "200%",
                        width: "200%",
                        position: "absolute",
                      }}
                    />
                  </>
                )}
              </LeanView>
            ) : (
              <>
                {item.channel_message.body_text_length > 0 ? (
                  <LeanText
                    tw={"text-sm text-gray-900 dark:text-gray-100"}
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
                    {messageWasEdited && (
                      <LeanText tw="text-xs text-gray-500 dark:text-gray-200">
                        {` • edited`}
                      </LeanText>
                    )}
                  </LeanText>
                ) : null}
              </>
            )}

            {/* ADD LETER
            {item.channel_message?.attachments?.length > 0 &&
            item.channel_message?.attachments[0].mime.includes("video") ? (
              <Video
                shouldPlay
                source={{ uri: item.channel_message.attachments[0]?.url }}
                useNativeControls
                style={{ width: 300, height: 250 }}
                resizeMode={ResizeMode.COVER}
              />
            ) : null}
            */}

            {item.channel_message?.attachments?.length > 0 &&
            item.channel_message?.attachments[0].mime.includes("image") ? (
              <ImagePreview
                attachment={item.channel_message?.attachments[0]}
                isViewable={permissions?.can_view_creator_messages}
              />
            ) : null}

            {item.channel_message?.attachments?.length > 0 &&
            item.channel_message?.attachments[0].mime.includes("audio") ? (
              <AudioPlayer
                id={item.channel_message.id}
                url={item.channel_message.attachments[0]?.url}
                duration={item.channel_message.attachments[0]?.duration}
                isViewable={permissions?.can_view_creator_messages}
              />
            ) : null}
            {item.reaction_group.length > 0 ? (
              <AnimatedView layout={Layout}>
                <MessageReactions
                  key={channel_message.id}
                  reactionGroup={item.reaction_group}
                  channelId={channelId}
                  channelReactions={reactions}
                  messageId={channel_message.id}
                />
              </AnimatedView>
            ) : null}
          </LeanView>
        </LeanView>
      </AnimatedView>
    );
  }
);

MessageItem.displayName = "MessageItem";
