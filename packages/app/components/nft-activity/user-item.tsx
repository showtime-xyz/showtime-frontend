import { Link } from "solito/link";

import { formatAddressShort } from "app/utilities";

import { Image } from "design-system/image";
import { Text } from "design-system/text";
import { VerificationBadge } from "design-system/verification-badge";
import { View } from "design-system/view";

import type { UserItemProps } from "./nft-activity.types";

const getProfileImageUrl = (imgUrl: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s64";
  }
  return imgUrl;
};

const UserItem = ({
  imageUrl,
  userAddress,
  username,
  verified,
}: UserItemProps) => {
  const link = username ? `@${username}` : userAddress;
  const linkText = username ? `@${username}` : formatAddressShort(userAddress);

  return (
    <View tw="flex flex-row items-center">
      {imageUrl ? (
        <View tw="mr-2 h-6 w-6 overflow-hidden rounded-full bg-white">
          <Image
            width={24}
            height={24}
            tw="h-full w-full"
            source={{ uri: getProfileImageUrl(imageUrl) }}
            alt={username ?? userAddress ?? "User"}
          />
        </View>
      ) : null}
      <Link href={"/" + link}>
        <Text tw={"mr-1 text-sm text-blue-600 dark:text-blue-400"}>
          {linkText}
        </Text>
      </Link>
      {verified ? <VerificationBadge size={12} /> : null}
    </View>
  );
};

export default UserItem;
