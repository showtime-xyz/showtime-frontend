import React from "react";
import { Image } from "design-system/image";
import { View } from "design-system/view";
import { Skeleton } from "design-system/skeleton";
import { useNFTOwnership } from "app/hooks/api/use-nft-ownership";
import { NFT } from "app/types";

type Props = {
  nft?: NFT;
  options?: boolean;
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
        "flex flex-row	flex-wrap justify-between w-[30px] h-[30px]",
        count < 3 ? "content-center" : "content-between",
      ]}
      children={children}
    />
  );
}

export function Ownership({ nft }: Props) {
  if (!nft) return null;

  const { data, loading, error } = useNFTOwnership(nft.nft_id);

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
              radius="round"
              show={true}
            />
          ))}
      </OwnershipContainer>
    );
  }

  if (nft.owner_count === 1) {
    return (
      <Image
        tw="w-[32px] h-[32px] rounded-full"
        source={{ uri: data?.multiple_owners_list[0].img_url }}
      />
    );
  }

  return (
    <OwnershipContainer count={data?.owner_count ?? nft.owner_count}>
      {data?.multiple_owners_list.slice(0, 4).map((owner) => (
        <Skeleton
          key={`nft-${nft.nft_id}-owner-${owner.profile_id}-skeleton`}
          tw="w-[14px] h-[14px]"
          radius="round"
          show={loading}
        >
          <Image
            key={`nft-${nft.nft_id}-owner-${owner.profile_id}`}
            tw="w-[14px] h-[14px] rounded-full bg-gray-200 dark:bg-gray-800"
            source={{ uri: owner.img_url }}
          />
        </Skeleton>
      ))}
    </OwnershipContainer>
  );
}
