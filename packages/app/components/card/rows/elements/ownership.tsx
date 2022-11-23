import { Avatar } from "@showtime-xyz/universal.avatar";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { useNFTDetails } from "app/hooks/use-nft-details";
import { Link } from "app/navigation/link";
import { NFT } from "app/types";
import { formatAddressShort } from "app/utilities";

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
        "flex h-8 w-8 flex-row flex-wrap justify-between",
        count < 3 ? "content-center" : "content-between",
      ]}
    >
      {children}
    </View>
  );
}

export function Ownership({ nft }: Props) {
  const { data } = useNFTDetails(nft?.nft_id);

  if (!nft) return null;

  // if (loading) {
  //   return (
  //     <OwnershipContainer count={nft.owner_count}>
  //       {Array(nft.owner_count)
  //         .fill(0)
  //         .slice(0, 4)
  //         .map((_, index) => (
  //           <Skeleton
  //             key={`nft-${nft.nft_id}-owner-${index}-skeleton`}
  //             width={14}
  //             height={14}
  //             colorMode={isDarkMode ? "dark" : "light"}
  //             radius="round"
  //             show={true}
  //           />
  //         ))}
  //     </OwnershipContainer>
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
        <OwnershipContainer count={data?.owner_count ?? nft.owner_count}>
          {data?.multiple_owners_list?.slice(0, 4).map((owner) => (
            <Avatar
              key={`nft-${nft.nft_id}-owner-${owner.profile_id}`}
              tw="h-[14px] w-[14px] rounded-full bg-gray-200 dark:bg-gray-800"
              size={14}
              url={owner.img_url}
              alt="Avatar"
            />
          ))}
        </OwnershipContainer>
        <View tw="w-2" />
        <View>
          <Text tw="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Owners
          </Text>
          <View tw="h-2" />
          <Text tw="text-13 font-semibold text-gray-900 dark:text-white">
            Multiple
          </Text>
        </View>
      </View>
    );
  }

  if (data?.owner_count && data.owner_count === 1) {
    return (
      <Link
        href={`/@${nft.owner_username ?? nft.owner_address}`}
        tw="flex flex-row"
      >
        <Avatar url={nft.owner_img_url} alt="Avatar" />
        <View tw="ml-2 justify-center">
          <Text tw="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Owner
          </Text>
          <View tw="h-2" />
          <View tw="flex flex-row items-center">
            <Text tw="text-13 font-semibold text-gray-900 dark:text-white">
              {nft.owner_username
                ? `@${nft.owner_username}`
                : nft.owner_name
                ? nft.owner_name
                : formatAddressShort(nft.owner_address)}
            </Text>
            {nft.owner_verified ? (
              <VerificationBadge style={{ marginLeft: 4 }} size={12} />
            ) : null}
          </View>
        </View>
      </Link>
    );
  }

  return null;
}
