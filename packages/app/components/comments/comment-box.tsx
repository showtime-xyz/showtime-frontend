import { Button, Image, TextInput, View } from "design-system";
import { Send } from "design-system/icon";
import { tw } from "design-system/tailwind";
import { DEFAULT_PROFILE_PIC } from "../../lib/constants";
import type { NFT } from "app/types";

const getProfileImageUrl = (imgUrl: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s112";
  }
  return imgUrl;
};

interface CommentBoxProps {
  nft?: NFT;
}

export function CommentBox({ nft }: CommentBoxProps) {
  if (!nft) {
    return null;
  }
  return (
    <View tw="flex-row p-4 items-center bg-white dark:bg-black">
      <View tw="flex-1 mr-2">
        <TextInput
          placeholder="Add a comment..."
          placeholderTextColor={
            tw.style("text-gray-500 dark:text-gray-400").color as string
          }
          multiline={true}
          keyboardType="twitter"
          returnKeyType="send"
          tw="py-3 pr-3 pl-[44px] rounded-[32px] text-base text-black dark:text-white bg-gray-100 dark:bg-gray-900"
        />
        <Image
          tw="absolute mt-3.5 ml-3 w-[24px] h-[24px] rounded-full"
          source={{
            uri: getProfileImageUrl(nft.owner_img_url ?? DEFAULT_PROFILE_PIC),
          }}
        />
      </View>
      <Button size="regular" iconOnly={true}>
        <Send />
      </Button>
    </View>
  );
}
