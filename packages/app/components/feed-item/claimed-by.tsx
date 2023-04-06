import { useMemo } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
import { TextLink } from "app/navigation/link";
import type { NFT } from "app/types";

type NFTDetailsProps = {
  nft: NFT | undefined;
  claimersList: NFT["multiple_owners_list"] | undefined;
  tw?: string;
};
export const ClaimedBy = ({ nft, claimersList, tw = "" }: NFTDetailsProps) => {
  const router = useRouter();
  const slicedClaimersList = useMemo(
    () => claimersList?.slice(1, 5),
    [claimersList]
  );
  if (!claimersList || claimersList?.length <= 1) {
    return null;
  }

  const firstClaimer = claimersList[1];

  return (
    <View tw={["ml-2 flex-row items-center", tw]}>
      <>
        {slicedClaimersList?.map((item, index) => {
          return (
            <View tw="-ml-2" key={index}>
              <AvatarHoverCard
                username={item?.username || item?.wallet_address}
                url={item?.img_url}
                tw="rounded-full border border-gray-300"
                size={20}
                alt="Claimed by Avatar"
              />
            </View>
          );
        })}
        <Text tw="ml-1 flex-1 text-xs text-white dark:text-white md:text-sm md:text-gray-900">
          <TextLink
            href={`/@${firstClaimer.username ?? firstClaimer.wallet_address}`}
            tw="font-bold"
          >
            {firstClaimer.name}
          </TextLink>
          {claimersList?.length && claimersList?.length >= 2 && (
            <>
              {` & `}
              <Text
                onPress={() => {
                  const as = `/collectors/${nft?.chain_name}/${nft?.contract_address}/${nft?.token_id}`;
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
                          collectorsModal: true,
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
                {`${claimersList?.length - 1} collected`}
              </Text>
            </>
          )}
        </Text>
      </>
    </View>
  );
};

export const ClaimedByReduced = ({
  nft,
  claimersList,
  tw = "",
  size = "small",
}: NFTDetailsProps & { size?: "small" | "regular" }) => {
  const router = useRouter();
  const slicedClaimersList = useMemo(
    () => claimersList?.slice(1, 5),
    [claimersList]
  );

  return (
    <View
      tw={[
        "flex-row items-center",
        tw,
        size === "small" ? "ml-1 h-5" : "ml-4 h-12",
      ]}
    >
      <>
        {slicedClaimersList?.map((item, index) => {
          return (
            <View tw={size === "small" ? "-ml-1" : "-ml-4"} key={index}>
              <AvatarHoverCard
                username={item?.username || item?.wallet_address}
                url={item?.img_url}
                tw="border border-gray-300 dark:border-gray-700"
                size={size === "small" ? 20 : 50}
                alt="Claimed by Avatar"
              />
            </View>
          );
        })}
        <Text tw="flex-1 text-sm text-gray-900 dark:text-white">
          {claimersList?.length && claimersList?.length >= 4 && (
            <>
              {` & `}
              <Text
                onPress={() => {
                  const as = `/collectors/${nft?.chain_name}/${nft?.contract_address}/${nft?.token_id}`;
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
                          collectorsModal: true,
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
                {`${claimersList?.length - 4} collected`}
              </Text>
            </>
          )}
          {` collected`}
        </Text>
      </>
    </View>
  );
};
