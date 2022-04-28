import { useMemo } from "react";

import {
  formatDistanceToNowStrict,
  differenceInSeconds,
  formatDistance,
} from "date-fns";

import { Avatar } from "design-system/avatar";
import { Button, TextButton } from "design-system/button";
import { HeartFilled, Heart, MessageFilled, Message } from "design-system/icon";
import { Text, linkify } from "design-system/text";
import { VerificationBadge } from "design-system/verification-badge";
import { View } from "design-system/view";

import { colors } from "../tailwind/colors";

interface MessageRowProps {
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
  replayCount?: number | string;
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
  username = "",
  userAvatar,
  userVerified = false,
  content = "",
  likeCount = 0,
  replayCount,
  createdAt,
  position,
  hasParent,
  hasReplies,
  likedByMe,
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

    const createdAtDate = new Date(createdAt);

    if (differenceInSeconds(new Date(), createdAtDate) < 10) {
      return "now";
    }

    return formatDistanceToNowStrict(new Date(createdAt), {
      addSuffix: true,
    });
  }, [createdAt]);
  const contentWithTags = useMemo(
    () =>
      onTagPress
        ? linkify(content, (text: string, link: string) => (
            <Text
              key={`link-${link}`}
              tw="font-bold text-black dark:text-white"
              onPress={() => onTagPress(link)}
            >
              {`@${text} `}
            </Text>
          ))
        : content,
    [content, onTagPress]
  );
  //#endregion

  //#region styles
  const replyVerticalLineTW = useMemo(
    () => [
      "absolute",
      "w-[1px]",
      "bg-[#27272A]",
      hasReplies
        ? "top-4 bottom-[-16px]"
        : position !== "last"
        ? "top-[-16px] bottom-[-16px]"
        : "top-[-16px] h-4",
      hasReplies ? "left-1/2" : "left--5",
    ],
    [hasReplies, position]
  );
  const replyHorizontalLineTW = useMemo(
    () => ["absolute", "left--5 right-0"],
    []
  );
  const replyHorizontalLineStyle = useMemo(
    () => ({
      borderBottomLeftRadius: 12,
      borderBottomWidth: position === "last" ? 1 : 0,
      borderLeftWidth: position === "last" ? 1 : 0,
      top: position !== "last" ? 12 : 0,
      height: position === "last" ? 12 : hasParent ? 1 : 0,
      backgroundColor: position !== "last" ? "#27272A" : undefined,
      borderColor: "#27272A",
    }),
    [position, hasParent]
  );
  //#endregion
  return (
    <View tw="flex flex-row bg-white py-4 dark:bg-black">
      {hasParent && <View tw="ml-8" collapsable={true} />}
      <View tw="items-center">
        {(hasReplies || hasParent) && (
          <>
            <View tw={replyHorizontalLineTW} style={replyHorizontalLineStyle} />
            <View tw={replyVerticalLineTW} />
          </>
        )}
        <Button
          variant="secondary"
          size="small"
          tw="h-[24px] w-[24px]"
          onPress={onUserPress ? () => onUserPress(username) : undefined}
          iconOnly
        >
          <Avatar url={userAvatar} size={24} />
        </Button>
      </View>
      <View tw="ml-2 flex-1">
        <View tw="mb-3 h-[12px] flex-row items-center">
          <Text
            sx={{ fontSize: 13, lineHeight: 15 }}
            tw="font-semibold text-gray-900 dark:text-white"
            onPress={onUserPress ? () => onUserPress(username) : undefined}
          >
            @{username}
          </Text>
          {userVerified ? (
            <VerificationBadge style={{ marginLeft: 4 }} size={12} />
          ) : null}
        </View>

        <Text
          tw="text-gray-900 dark:text-gray-100"
          sx={{ fontSize: 13, lineHeight: 15 }}
        >
          {contentWithTags}
        </Text>

        <View tw="ml--2 mt-2 mb--2 flex-row">
          <Button
            variant="text"
            tw="px-2"
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
          {replayCount != undefined && (
            <TextButton
              tw="px-2"
              accentColor={
                // TODO: use `repliedByMe` when this is available.
                replayCount > 0
                  ? [colors.black, colors.white]
                  : [colors.gray[500], colors.gray[500]]
              }
              onPress={onReplyPress}
            >
              {
                // TODO: use `repliedByMe` when this is available.
                replayCount > 0 ? <MessageFilled /> : <Message />
              }
              {` ${replayCount}`}
            </TextButton>
          )}
          <View
            tw={[
              "flex-1 flex-row items-center justify-end",
              onDeletePress ? "mr--3" : "",
            ]}
          >
            {createdAtText && (
              <Text tw="font-bold text-gray-500" variant="text-xs">
                {`${createdAtText}${onDeletePress ? "  •" : ""}`}
              </Text>
            )}
            {onDeletePress && (
              <Button variant="text" tw="ml--1.5" onPress={onDeletePress}>
                Delete
              </Button>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
