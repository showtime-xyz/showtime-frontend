import { useNFTDetails } from "app/hooks/use-nft-details";
import { Link } from "app/navigation/link";
import { NFT } from "app/types";

import { Avatar } from "design-system/avatar";
import { useIsDarkMode } from "design-system/hooks";
import { Skeleton } from "design-system/skeleton";
import { Text } from "design-system/text";
import { VerificationBadge } from "design-system/verification-badge";
import { View } from "design-system/view";

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
              tw="w-[14px] h-[14px] rounded-full bg-gray-200 dark:bg-gray-800"
              size={14}
              url={owner.img_url}
            />
          ))}
        </OwnershipContainer>
        <View tw="w-2" />
        <View tw="">
          <Text
            variant="text-xs"
            tw="mb-1 text-gray-600 dark:text-gray-400 font-semibold"
          >
            Owners
          </Text>
          <Text
            variant="text-13"
            tw="text-gray-900 dark:text-white font-semibold"
          >
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
        <Avatar url={nft.owner_img_url} />
        <View tw="ml-2 justify-center">
          <Text
            sx={{ fontSize: 12, lineHeight: 12 }}
            tw={`${
              nft.owner_username ? "mb-1" : ""
            } text-gray-600 dark:text-gray-400 font-semibold`}
          >
            Owner
          </Text>
          {nft.owner_username && (
            <View tw="h-[12px] flex flex-row items-center">
              <Text
                sx={{ fontSize: 13, lineHeight: 15 }}
                tw="text-gray-900 dark:text-white font-semibold"
              >
                @{nft.owner_username}
              </Text>
              {nft.owner_verified ? (
                <VerificationBadge style={{ marginLeft: 4 }} size={12} />
              ) : null}
            </View>
          )}
        </View>
      </Link>
    );
  }

  return null;
}
