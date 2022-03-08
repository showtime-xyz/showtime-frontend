import { formatDistanceToNowStrict } from "date-fns";

import { DEFAULT_PROFILE_PIC } from "app/lib/constants";
import { Link } from "app/navigation/link";
import { useRouter } from "app/navigation/use-router";
import type { NFT } from "app/types";
import { formatAddressShort } from "app/utilities";

import { Image } from "design-system/image";
import { Text } from "design-system/text";
import { VerificationBadge } from "design-system/verification-badge";
import { View } from "design-system/view";

const getProfileImageUrl = (imgUrl: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s112";
  }
  return imgUrl;
};

type Props = {
  nft?: NFT;
  options?: boolean;
};

export function Creator({ nft }: Props) {
  const router = useRouter();

  if (!nft) return null;

  return (
    <Link
      href={`${
        router.pathname.startsWith("/trending") ? "/trending" : ""
      }/profile/${nft.creator_address}`}
      tw="flex flex-row"
    >
      <Image
        tw="w-[32px] h-[32px] rounded-full"
        source={{
          uri: getProfileImageUrl(nft.creator_img_url ?? DEFAULT_PROFILE_PIC),
        }}
      />
      <View tw="ml-2 justify-center">
        {nft.creator_username ? (
          <View tw="h-[12px] flex flex-row items-center">
            <Text
              sx={{ fontSize: 13, lineHeight: 15 }}
              tw="text-white font-semibold"
            >
              @{nft.creator_username}
            </Text>
            {nft.creator_verified ? (
              <VerificationBadge style={{ marginLeft: 4 }} size={12} />
            ) : null}
          </View>
        ) : (
          <View>
            <Text sx={{ fontSize: 13 }} tw="text-white font-bold">
              {formatAddressShort(nft.creator_address)}
            </Text>
            {nft.token_created ? (
              <Text tw="text-xs text-white mt-1 font-semibold">
                {formatDistanceToNowStrict(new Date(`${nft.token_created}`), {
                  addSuffix: true,
                })}
              </Text>
            ) : null}
          </View>
        )}
      </View>
    </Link>
  );
}
