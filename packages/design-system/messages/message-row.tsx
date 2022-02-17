import { useMemo } from "react";
import { StyleSheet } from "react-native";

import { formatDistanceToNowStrict } from "date-fns";

import { Avatar } from "design-system/avatar";
import { TextButton } from "design-system/button";
import { HeartFilled, MessageFilled } from "design-system/icon";
import { Text } from "design-system/text";
import { VerificationBadge } from "design-system/verification-badge";
import { View } from "design-system/view";

interface MessageRowProps {
  username?: string;
  userAvatar?: string;
  userVerified?: boolean | 0 | 1;
  hasParent?: boolean;
  hasReplies?: boolean;
  content?: string;
  likeCount?: number;
  replayCount?: number;
  createdAt?: string;

  onLikePress?: () => void;
  onDeletePress?: () => void;
}

export function MessageRow({
  username,
  userAvatar,
  userVerified = false,
  content = "",
  likeCount = 0,
  replayCount = 0,
  createdAt,
  hasParent,
  hasReplies,
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
  const nestedLineTW = useMemo(
    () => [
      "absolute",
      "left-1/2",
      hasReplies ? "right--1/2" : "right-1/2",
      hasReplies ? "top-4 bottom-[-16px]" : "top-[-16px] left--5 h-[28px]",
      "border-[#27272A]",
    ],
    [hasReplies]
  );
  const nestedLineStyle = useMemo(
    () => [
      styles.nestedLine,
      hasParent
        ? {
            borderBottomWidth: 1,
            borderBottomLeftRadius: 12,
          }
        : undefined,
    ],
    [hasParent]
  );
  //#region
  return (
    <View tw="flex flex-row py-4 bg-white dark:bg-black">
      {hasParent && <View tw="ml-8" collapsable={true} />}
      <View tw="items-center">
        {(hasReplies || hasParent) && (
          <View tw={nestedLineTW} style={nestedLineStyle} />
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

        <View tw="flex-row mt-2 mb--2">
          <TextButton tw="px-2" onPress={onLikePress}>
            <HeartFilled /> {`${likeCount}`}
          </TextButton>
          <TextButton tw="px-2">
            <MessageFilled /> {`${replayCount}`}
          </TextButton>
          <View tw="flex-1 flex-row mr--3 items-center justify-end">
            {createdAtText && (
              <Text tw="text-gray-500 font-bold" variant="text-xs">
                {`${createdAtText}  •`}
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

const styles = StyleSheet.create({
  nestedLine: {
    borderLeftWidth: 1,
  },
});

// export const MessageRow = () => <Text>Test</Text>;
