import React from "react";

import { useNFTDetails } from "app/hooks/use-nft-details";
import { DEFAULT_PROFILE_PIC } from "app/lib/constants";
import { NFT } from "app/types";

import { useIsDarkMode } from "design-system/hooks";
import { Image } from "design-system/image";
import { Skeleton } from "design-system/skeleton";
import { Text } from "design-system/text";
import { View } from "design-system/view";

type Props = {
  nft?: NFT;
  options?: boolean;
};

const getProfileImageUrl = (imgUrl: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s112";
  }
  return imgUrl;
};

function OwnershipContainer({
  count,
  children,
}: React.PropsWithChildren<{
  count: number;
}>): JSX.Element {
  return count === 1 ? (
    (children as any)
  ) : (
    <View
      tw={[
        "flex flex-row flex-wrap justify-between w-[30px] h-[30px]",
        count < 3 ? "content-center" : "content-between",
      ]}
      children={children}
    />
  );
}

export function Ownership({ nft }: Props) {
  if (!nft) return null;

  const isDarkMode = useIsDarkMode();
  const { data, loading, error } = useNFTDetails(nft.nft_id);

  if (loading) {
    return (
      <OwnershipContainer count={nft.owner_count}>
        {Array(nft.owner_count)
          .fill(0)
          .slice(0, 4)
          .map((_, index) => (
            <Skeleton
              key={`nft-${nft.nft_id}-owner-${index}-skeleton`}
              width={14}
              height={14}
              colorMode={isDarkMode ? "dark" : "light"}
              radius="round"
              show={true}
            />
          ))}
      </OwnershipContainer>
    );
  }

  // if (nft.owner_count === 1) {
  //   return (
  //     <Image
  //       tw="w-[32px] h-[32px] rounded-full"
  //       source={{
  //         uri: getProfileImageUrl(
  //           data?.multiple_owners_list[0].img_url ?? DEFAULT_PROFILE_PIC
  //         ),
  //       }}
  //     />
  //   );
  // }

  if (
    data?.owner_count &&
    data.owner_count > 1 &&
    data?.multiple_owners_list &&
    data.multiple_owners_list?.length > 0
  ) {
    return (
      <View tw="flex flex-row">
        <View tw="mr-2">
          <Text
            sx={{ fontSize: 12 }}
            tw="mb-1 text-right text-gray-600 dark:text-gray-400 font-semibold"
          >
            Owners
          </Text>
          <Text
            sx={{ fontSize: 13, lineHeight: 13 }}
            tw="text-right text-gray-900 dark:text-white font-semibold"
          >
            Multiple
          </Text>
        </View>
        <OwnershipContainer count={data?.owner_count ?? nft.owner_count}>
          {data?.multiple_owners_list?.slice(0, 4).map((owner) => (
            <Image
              key={`nft-${nft.nft_id}-owner-${owner.profile_id}`}
              tw="w-[14px] h-[14px] rounded-full bg-gray-200 dark:bg-gray-800"
              source={{
                uri: getProfileImageUrl(owner.img_url ?? DEFAULT_PROFILE_PIC),
              }}
            />
          ))}
        </OwnershipContainer>
      </View>
    );
  }

  return null;
}
