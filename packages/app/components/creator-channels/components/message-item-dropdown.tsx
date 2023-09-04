import { memo, useMemo, RefObject } from "react";
import { Platform } from "react-native";

import Animated, {
  runOnJS,
  runOnUI,
  measure,
  useAnimatedRef,
  enableLayoutAnimations,
} from "react-native-reanimated";

import { useAlert } from "@showtime-xyz/universal.alert";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Edit, Trash, Flag } from "@showtime-xyz/universal.icon";
import { MoreHorizontal } from "@showtime-xyz/universal.icon";
import { FlashList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";

import { useUser } from "app/hooks/use-user";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";

import { MenuItemIcon } from "../../dropdown/menu-item-icon";
import { useDeleteMessage } from "../hooks/use-delete-message";
import { MessageItemProps } from "../types";

export const MessageItemDropdown = memo(
  ({
    item,
    channelId,
    listRef,
    setEditMessage,
    editMessageItemDimension,
  }: MessageItemProps & {
    listRef: RefObject<FlashList<any>>;
    editMessageItemDimension: Animated.SharedValue<{
      height: number;
      pageY: number;
    }>;
  }) => {
    const { channel_message } = item;
    const deleteMessage = useDeleteMessage(channelId);
    const Alert = useAlert();
    const isDark = useIsDarkMode();
    const user = useUser();
    const animatedViewRef = useAnimatedRef<any>();
    const router = useRouter();

    // flag to allow message editing, if message is not older than 2 hours
    const allowMessageEditing = useMemo(() => {
      const createdTime = new Date(channel_message.created_at);
      const currentTime = new Date();

      const timeDifference = currentTime.getTime() - createdTime.getTime(); // Time difference in milliseconds

      const maximumDuration = 7200000; // 2 hours in milliseconds

      if (timeDifference <= maximumDuration) return true;

      return false;
    }, [channel_message.created_at]);

    return (
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
              user.user?.data.profile.profile_id && allowMessageEditing ? (
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
                      Platform.OS === "web" ? router.pathname : "/report",
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
    );
  }
);
MessageItemDropdown.displayName = "MessageItemDropdown";
