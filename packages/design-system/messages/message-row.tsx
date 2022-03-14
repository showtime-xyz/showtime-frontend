import { useMemo } from "react";

import { formatDistanceToNowStrict } from "date-fns";

import { Avatar } from "design-system/avatar";
import { TextButton } from "design-system/button";
import { HeartFilled, Heart } from "design-system/icon";
import { Text } from "design-system/text";
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
   * Defines whether the message liked by customer or not.
   * @default undefined
   */
  likedByMe?: boolean;
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
}

export function MessageRow({
  username,
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
  onLikePress,
  onDeletePress,
}: MessageRowProps) {
  //#region variables
  const createdAtText = useMemo(
    () =>
      createdAt
        ? formatDistanceToNowStrict(new Date(createdAt), {
            addSuffix: true,
          })
        : undefined,
    [createdAt]
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
      height: position === "last" ? 12 : 1,
      backgroundColor: position !== "last" ? "#27272A" : undefined,
      borderColor: "#27272A",
    }),
    [position]
  );
  //#region
  return (
    <View tw="flex flex-row py-4 bg-white dark:bg-black">
      {hasParent && <View tw="ml-8" collapsable={true} />}
      <View tw="items-center">
        {(hasReplies || hasParent) && (
          <>
            <View tw={replyHorizontalLineTW} style={replyHorizontalLineStyle} />
            <View tw={replyVerticalLineTW} />
          </>
        )}
        <Avatar url={userAvatar} size={24} />
      </View>
      <View tw="flex-1 ml-2">
        <View tw="mb-3 h-[12px] flex-row items-center">
          <Text
            sx={{ fontSize: 13, lineHeight: 15 }}
            tw="text-gray-900 dark:text-white font-semibold"
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
          {content}
        </Text>

        <View tw="flex-row ml--2 mt-2 mb--2">
          <TextButton
            tw="px-2"
            accentColor={
              likedByMe
                ? ["black", "white"]
                : [colors.gray[500], colors.gray[500]]
            }
            onPress={onLikePress}
          >
            {likedByMe ? <HeartFilled /> : <Heart />}
            {` ${likeCount}`}
          </TextButton>
          {/* TODO: re-enable when replies pagination is implemented {replayCount != undefined && (
            <TextButton tw="px-2">
              <MessageFilled /> {replayCount}
            </TextButton>
          )} */}
          <View
            tw={[
              "flex-1 flex-row items-center justify-end",
              onDeletePress ? "mr--3" : "",
            ]}
          >
            {createdAtText && (
              <Text tw="text-gray-500 font-bold" variant="text-xs">
                {`${createdAtText}${onDeletePress ? "  •" : ""}`}
              </Text>
            )}
            {onDeletePress && (
              <TextButton tw="ml--1.5" onPress={onDeletePress}>
                Delete
              </TextButton>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
