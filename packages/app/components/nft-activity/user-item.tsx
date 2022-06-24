import { Image } from "@showtime-xyz/universal.image";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import type { UserItemProps } from "./nft-activity.types";

const getProfileImageUrl = (imgUrl: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s112";
  }
  return imgUrl;
};

const UserItem = ({ imageUrl, title, verified }: UserItemProps) => {
  return (
    <View tw="flex flex-row items-center">
      <View
        tw={`mr-2 h-6 w-6 overflow-hidden rounded-full ${
          imageUrl ? "" : "bg-white"
        }`}
      >
        {imageUrl ? (
          <Image
            width={24}
            height={24}
            tw="h-full w-full"
            source={{ uri: getProfileImageUrl(imageUrl) }}
          />
        ) : null}
      </View>
      <Text tw={"mr-1 text-xs text-black dark:text-white"}>{`@${title}`}</Text>
      {verified ? <VerificationBadge size={12} /> : null}
    </View>
  );
};

export default UserItem;
