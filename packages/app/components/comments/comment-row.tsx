import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { formatDistanceToNowStrict } from "date-fns";
import { View, Image, Text } from "design-system";
import { VerificationBadge } from "design-system/verification-badge";
import { HeartFilled, MessageFilled } from "design-system/icon";
import { TextButton } from "design-system/button";
import { DEFAULT_PROFILE_PIC } from "../../lib/constants";
import type { NFT } from "app/types";

const getProfileImageUrl = (imgUrl: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s112";
  }
  return imgUrl;
};

interface CommentRowProps {
  hasParent?: boolean;
  hasComments?: boolean;
  content?: string;
  likeCount?: number;
  commentCount?: number;
  createdAt?: string;
  nft?: NFT;
}

export function CommentRow({
  content = "",
  likeCount = 0,
  commentCount = 0,
  createdAt,
  hasParent,
  hasComments,
  nft,
}: CommentRowProps) {
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
      hasComments ? "right--1/2" : "right-1/2",
      hasComments ? "top-4 bottom-[-16px]" : "top-[-16px] left--5 h-[28px]",
      "border-[#27272A]",
    ],
    [hasComments]
  );
  const nestedLineStyle = useMemo(
    () => [
      styles.nestedLine,
      hasParent
        ? {
            borderBottomLeftRadius: 12,
          }
        : undefined,
    ],
    [hasParent]
  );
  //#region

  if (!nft) {
    return null;
  }
  return (
    <View tw="flex flex-row p-4 bg-white dark:bg-black">
      {hasParent && <View tw="ml-8" collapsable={true} />}
      <View tw="items-center">
        {(hasComments || hasParent) && (
          <View tw={nestedLineTW} style={nestedLineStyle} />
        )}
        <Image
          tw="w-[24px] h-[24px] rounded-full"
          source={{
            uri: getProfileImageUrl(nft?.owner_img_url ?? DEFAULT_PROFILE_PIC),
          }}
        />
      </View>
      <View tw="flex-1 ml-2">
        <View tw="mb-3 h-[12px] flex-row items-center">
          <Text
            sx={{ fontSize: 13, lineHeight: 15 }}
            tw="text-gray-900 dark:text-white font-semibold"
          >
            @{nft.creator_username}
          </Text>
          {nft.creator_verified ? (
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
          <TextButton tw="px-2">
            <HeartFilled /> {`${likeCount}`}
          </TextButton>
          <TextButton tw="px-2">
            <MessageFilled /> {`${commentCount}`}
          </TextButton>
          <View tw="flex-1 flex-row mr--4 items-center justify-end">
            {createdAtText && (
              <Text tw="text-gray-500 font-bold mr--1.5" variant="text-xs">
                {`${createdAtText}  •`}
              </Text>
            )}
            <TextButton>Delete</TextButton>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nestedLine: {
    borderLeftWidth: 1,
    borderBottomWidth: 1,
  },
});
