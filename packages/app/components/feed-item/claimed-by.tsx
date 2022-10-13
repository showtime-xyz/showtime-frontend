import { Platform } from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Link, TextLink } from "app/navigation/link";
import type { NFT } from "app/types";

type NFTDetailsProps = {
  nft: NFT | undefined;
  claimersList: NFT["multiple_owners_list"] | undefined;
  tw?: string;
};
export const ClaimedBy = ({ nft, claimersList, tw = "" }: NFTDetailsProps) => {
  const router = useRouter();
  if (!claimersList || claimersList?.length <= 1) {
    return null;
  }
  const slicedClaimersList = claimersList?.slice(1, 4);
  const firstClaimer = claimersList[1];

  return (
    <View tw={["ml-2 flex-row items-center", tw]}>
      <>
        {slicedClaimersList?.map((item) => {
          return (
            <View tw="-ml-2" key={item.profile_id}>
              <Link href={`/@${item.username ?? item.wallet_address}`}>
                <Avatar
                  url={item.img_url}
                  tw="border border-gray-300 dark:border-gray-700"
                  size={20}
                />
              </Link>
            </View>
          );
        })}
        <Text tw="ml-1 flex-1 text-sm text-gray-900 dark:text-white">
          {`Claimed by `}
          <TextLink
            href={`/@${firstClaimer.username ?? firstClaimer.wallet_address}`}
            tw="font-bold"
          >
            {firstClaimer.name}
          </TextLink>
          {claimersList?.length && claimersList?.length > 2 && (
            <>
              {` & `}
              <Text
                onPress={() => {
                  const as = `/claimers/${nft?.chain_name}/${nft?.contract_address}/${nft?.token_id}`;
                  router.push(
                    Platform.select({
                      native: as,
                      web: {
                        pathname: router.pathname,
                        query: {
                          ...router.query,
                          contractAddress: nft?.contract_address,
                          tokenId: nft?.token_id,
                          chainName: nft?.chain_name,
                          claimersModal: true,
                        },
                      } as any,
                    }),
                    Platform.select({
                      native: as,
                      web: router.asPath,
                    }),
                    { shallow: true }
                  );
                }}
                tw="font-bold"
              >
                {`${claimersList?.length - 2} others`}
              </Text>
            </>
          )}
        </Text>
      </>
    </View>
  );
};
