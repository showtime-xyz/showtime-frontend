import { View, Image, Text, Button } from "design-system";
import { VerificationBadge } from "design-system/verification-badge";
import { HeartFilled, MessageFilled } from "design-system/icon";
import { DEFAULT_PROFILE_PIC } from "../../lib/constants";
import type { NFT } from "app/types";
import { TextButton } from "design-system/button";

const getProfileImageUrl = (imgUrl: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s112";
  }
  return imgUrl;
};

interface CommentRowProps {
  isReplay?: boolean;
  nft?: NFT;
}

export function MiniButton({}) {
  return (
    <Button variant="tertiary">
      <HeartFilled />
    </Button>
  );
}

export function CommentRow({ nft }: CommentRowProps) {
  return (
    <View tw="flex-row p-4 bg-white dark:bg-black">
      <Image
        tw="w-[24px] h-[24px] rounded-full"
        source={{
          uri: getProfileImageUrl(nft?.owner_img_url ?? DEFAULT_PROFILE_PIC),
        }}
      />
      <View tw="ml-2">
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
          This is a comment, This is a comment, This is a comment
        </Text>

        <View tw="flex-row mt-2 mb--2">
          <TextButton tw="px-2">
            <HeartFilled /> 15
          </TextButton>
          <TextButton tw="px-2">
            <MessageFilled /> 15
          </TextButton>
        </View>
      </View>
    </View>
  );
}
