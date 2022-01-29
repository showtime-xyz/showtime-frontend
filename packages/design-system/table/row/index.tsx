import { View } from "design-system/view";
import { Text } from "design-system/text";
import { Image } from "design-system/image";
import { VerificationBadge } from "design-system/verification-badge";
import { DEFAULT_PROFILE_PIC } from "app/lib/constants";
import type { NFT } from "app/types";
import { useRouter } from "app/navigation/use-router";
import { Link } from "app/navigation/link";

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

export function Row({ nft }: Props) {
  const router = useRouter();

  if (!nft) return null;

  console.log({ nft });

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
        <Text
          sx={{ fontSize: 12, lineHeight: 12 }}
          tw="mb-1 text-gray-600 dark:text-gray-400 font-semibold"
        >
          {nft.creator_name}
        </Text>
        <View tw="h-[12px] flex flex-row items-center">
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
      </View>
    </Link>
  );
}
