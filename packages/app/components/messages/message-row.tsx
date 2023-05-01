import { useMemo, useCallback, useRef, memo } from "react";
import { Platform } from "react-native";

import { formatDistanceToNowStrict, differenceInSeconds } from "date-fns";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { HeartFilled, Heart, Trash } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
import { linkifyDescription } from "app/lib/linkify";
import { Link } from "app/navigation/link";
import {
  cleanUserTextInput,
  convertUTCDateToLocalDate,
  formatAddressShort,
  limitLineBreaks,
} from "app/utilities";

interface MessageRowProps {
  /**
   * Defines the address of the message owner.
   * @default undefined
   */
  address?: string;
  /**
   * Defines the message owner username.
   * @default undefined
   */
  username?: string;
  /**
   * Defines the message owner avatar url.
   * @default undefined
   */
  userAvatar?: string;
  /**
   * Defines whether the message owner is verified or not.
   * @default undefined
   */
  userVerified?: boolean | 0 | 1;
  /**
   * Defines whether the message has parent or not.
   * @default undefined
   */
  hasParent?: boolean;
  /**
   * Defines whether the message has replies or not.
   * @default undefined
   */
  hasReplies?: boolean;
  /**
   * Defines whether the message liked by the customer or not.
   * @default undefined
   */
  likedByMe?: boolean;
  /**
   * Defines whether the reply is the last or not.
   * @default undefined
   */
  isLastReply?: boolean;
  /**
   * Defines whether the message replied by the customer or not.
   * @default undefined
   */
  repliedByMe?: boolean;
  /**
   * Defines the message content.
   * @default undefined
   */
  content?: string;
  /**
   * Defines the message position in the replies list.
   * @default undefined
   */
  position?: undefined | "middle" | "last";
  /**
   * Defines the message likes count.
   * @default undefined
   */
  likeCount?: number | string;
  /**
   * Defines the message replies count.
   * @default undefined
   */
  replyCount?: number;
  /**
   * Defines the message creation date.
   * @default undefined
   */
  createdAt?: string;
  /**
   * Defines the like press callback
   * @default undefined
   */
  onLikePress?: () => void;
  /**
   * Defines the delete press callback
   * @default undefined
   */
  onDeletePress?: () => void;
  /**
   * Defines the reply press callback
   * @default undefined
   */
  onReplyPress?: () => void;
  /**
   * Defines the content tag press callback
   * @default undefined
   */
  onTagPress?: (tag: string) => void;
  /**
   * Defines the user press callback
   * @default undefined
   */
  onUserPress?: (username: string) => void;
}
//const PlatformSwipeable = Platform.OS === "web" ? View : memo(Swipeable);
const PlatformSwipeable = View;
function MessageRowComponent({
  address,
  username = "",
  userAvatar,
  userVerified = false,
  content = "",
  likeCount = 0,
  //replyCount,
  createdAt,
  //position,
  hasParent,
  //hasReplies,
  isLastReply,
  likedByMe,
  // eslint-disable-next-line unused-imports/no-unused-vars
  repliedByMe,
  onLikePress,
  onDeletePress,
  onReplyPress,
  onTagPress,
  onUserPress,
}: MessageRowProps) {
  //#region variables
  const swipeRef = useRef<Swipeable>(null);
  const isDark = useIsDarkMode();
  /*
  const deleteComment = useCallback(async () => {
    if (onDeletePress) {
      try {
        await onDeletePress();
      } catch (error) {
        //console.log(error);
      } finally {
        if (swipeRef.current) {
          swipeRef.current.close();
        }
      }
    }
  }, [onDeletePress]);
  */

  const createdAtText = useMemo(() => {
    if (!createdAt) return undefined;

    const currentTime = new Date();
    const createdAtDate = convertUTCDateToLocalDate(createdAt);

    if (differenceInSeconds(currentTime, createdAtDate) < 10) {
      return "now";
    }

    return formatDistanceToNowStrict(createdAtDate, {
      addSuffix: true,
    });
  }, [createdAt]);

  const contentWithTags = useMemo(() => {
    return onTagPress
      ? linkifyDescription(
          limitLineBreaks(cleanUserTextInput(content)),
          "font-bold text-sm text-gray-900 dark:text-gray-100"
        )
      : limitLineBreaks(cleanUserTextInput(content));
  }, [content, onTagPress]);

  const userNameText = useMemo(() => {
    return username || formatAddressShort(address);
  }, [address, username]);
  //#endregion

  const handleOnPressUser = useCallback(() => {
    if (Platform.OS !== "web" && onUserPress) {
      onUserPress(username);
    }
  }, [onUserPress, username]);

  /*
  const renderLeftActions = useCallback(() => {
    return (
      <View tw="h-[94%] flex-1 items-end justify-center bg-red-500 px-3">
        <Button variant="text" tw="px-0 font-thin" style={{ padding: 0 }}>
          <Trash color="white" stroke="white" />
        </Button>
      </View>
    );
  }, []);
  */

  return (
    <PlatformSwipeable
      ref={swipeRef}
      //renderRightActions={renderLeftActions}
      //onSwipeableOpen={deleteComment}
      //friction={2}
      //rightThreshold={80}
      //enabled={!!onDeletePress && Platform.OS !== "web"}
    >
      <View tw="flex flex-row items-start px-4 py-1.5">
        {hasParent && <View tw="ml-4" collapsable={true} />}
        <View tw="justify-start">
          <View tw="-mb-1 -mt-1">
            <Button
              variant="secondary"
              size="small"
              tw="h-[20px] w-[20px]"
              onPress={handleOnPressUser}
              iconOnly
            >
              <AvatarHoverCard
                url={userAvatar}
                size={20}
                username={username || address}
                alt="MessageRow Avatar"
              />
            </Button>
          </View>
        </View>
        <View tw={["ml-2 flex-1", isLastReply ? "mb-1" : "-mb-0.5"]}>
          <Text tw="web:pr-12 pr-7 text-sm text-gray-900 dark:text-gray-100">
            <Link href={`/@${username || address}`}>
              <View tw="mr-3 flex-row items-center">
                <Text
                  tw="text-sm font-bold text-gray-900 dark:text-white"
                  onPress={handleOnPressUser}
                >
                  {userNameText}
                </Text>
                {userVerified ? (
                  <VerificationBadge
                    style={{
                      marginLeft: 4,
                      position: "absolute",
                      left: "100%",
                    }}
                    size={11}
                  />
                ) : null}
              </View>
            </Link>
            {userVerified ? <View tw="w-3" /> : null}
            {contentWithTags}
          </Text>

          <View tw={"flex-row space-x-3"}>
            <View tw="justify-center py-0">
              {createdAtText && (
                <Text tw="text-[10px] text-gray-500">{`${createdAtText}`}</Text>
              )}
            </View>
            <View tw="justify-center py-0">
              <Text tw="px-0 text-[10px] text-gray-500" onPress={onReplyPress}>
                Reply
              </Text>
            </View>

            <View
              tw={"flex-1 flex-row items-center justify-end space-x-3 px-0"}
            >
              <Button
                variant="text"
                tw="items-center justify-center px-0 py-0"
                accentColor={
                  likedByMe
                    ? [colors.black, colors.white]
                    : [colors.gray[500], colors.gray[500]]
                }
                onPress={onLikePress}
                style={{ padding: 0 }}
              >
                {likedByMe ? (
                  <HeartFilled color={isDark ? colors.white : colors.black} />
                ) : (
                  <Heart color={colors.gray[500]} />
                )}
                <Text tw="text-[12px] text-sm">{` ${likeCount}`}</Text>
              </Button>
              {onDeletePress ? (
                <Button
                  variant="text"
                  tw="px-0 font-thin"
                  onPress={onDeletePress}
                  style={{ padding: 0 }}
                  iconOnly
                >
                  <Trash />
                </Button>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </PlatformSwipeable>
  );
}

export const MessageRow = memo(MessageRowComponent);
MessageRow.displayName = "MessageRow";
