import { useMemo, useCallback } from "react";
import { Platform } from "react-native";

import { formatDistanceToNowStrict, differenceInSeconds } from "date-fns";

import { Button } from "@showtime-xyz/universal.button";
import { HeartFilled, Heart, Trash } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
import { linkifyDescription } from "app/lib/linkify";
import { Link } from "app/navigation/link";
import { convertUTCDateToLocalDate, formatAddressShort } from "app/utilities";

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

export function MessageRow({
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
          content,
          "font-bold text-xs text-gray-900 dark:text-gray-100"
        )
      : content;
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

  return (
    <View tw="flex flex-row items-start bg-white px-4 py-1 dark:bg-black">
      {hasParent && <View tw="ml-4" collapsable={true} />}
      <View tw="justify-start">
        <Link href={`/@${username || address}`} tw="-mt-1 -mb-1">
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
        </Link>
      </View>
      <View tw={["ml-2 flex-1", isLastReply ? "mb-1" : "-mb-0.5"]}>
        <Text tw="text-xs text-gray-900 dark:text-gray-100">
          <Link href={`/@${username || address}`}>
            <View tw="mr-3 flex-row items-center">
              <Text
                tw="text-xs font-bold text-gray-900 dark:text-white"
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

          <Button
            variant="text"
            tw="px-0 py-0"
            accentColor={
              likedByMe
                ? [colors.black, colors.white]
                : [colors.gray[500], colors.gray[500]]
            }
            onPress={onLikePress}
          >
            {likedByMe ? <HeartFilled /> : <Heart />}
            {` ${likeCount}`}
          </Button>

          <View tw={"flex-1 flex-row items-center justify-end px-0"}>
            {onDeletePress && (
              <Button
                variant="text"
                onPress={onDeletePress}
                tw="px-0 font-thin"
              >
                <Trash />
              </Button>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
