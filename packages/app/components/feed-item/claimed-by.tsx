import { useMemo } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
import { TextLink } from "app/navigation/link";
import type { NFT } from "app/types";

import { StockText } from "design-system/stock-text/stock-text";

type NFTDetailsProps = {
  nft: NFT | undefined;
  claimersList: NFT["multiple_owners_list"] | undefined;
  tw?: string;
  avatarSize?: number;
  textColor?: string;
};
export const ClaimedBy = ({
  nft,
  claimersList,
  avatarSize = 20,
  tw = "",
  textColor,
}: NFTDetailsProps) => {
  const router = useRouter();
  const slicedClaimersList = useMemo(
    () => claimersList?.slice(1, 5),
    [claimersList]
  );
  if (!claimersList || claimersList?.length <= 1) {
    return (
      <View tw={["h-4 flex-row items-center", tw]}>
        <Text
          tw="text-[12px] font-bold dark:text-white"
          style={textColor ? { color: textColor } : {}}
        >
          {nft?.creator_username
            ? `@${nft.creator_username} collected`
            : "The creator collected"}
        </Text>
      </View>
    );
  }

  const firstClaimer = claimersList[1];

  return (
    <View tw={["ml-2 h-4 flex-row items-center", tw]}>
      <>
        {slicedClaimersList?.map((item, index) => {
          return (
            <View tw="-ml-2" key={index}>
              <AvatarHoverCard
                username={item?.username || item?.wallet_address}
                url={item?.img_url}
                size={avatarSize}
                alt="Claimed by Avatar"
              />
              <View
                tw="absolute rounded-full border border-white dark:border-black"
                style={{
                  width: avatarSize,
                  height: avatarSize,
                }}
                pointerEvents="none"
              />
            </View>
          );
        })}
        <Text
          tw="ml-1 text-xs text-gray-900 dark:text-white md:text-sm"
          style={textColor ? { color: textColor } : {}}
        >
          <TextLink
            href={`/@${firstClaimer.username ?? firstClaimer.wallet_address}`}
            tw="font-bold"
          >
            {firstClaimer.name}
          </TextLink>
          {claimersList?.length && claimersList?.length >= 2 && (
            <>
              {` & `}
              <StockText
                tw="font-bold"
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
              >
                {`${claimersList?.length - 1} collected`}
              </StockText>
            </>
          )}
        </Text>
      </>
    </View>
  );
};

export const ClaimedByReduced = ({
  nft,
  claimersList = [],
  tw = "",
  size = "small",
}: NFTDetailsProps & { size?: "small" | "regular" }) => {
  const router = useRouter();
  const slicedClaimersList = useMemo(() => {
    if (!claimersList) return [];
    return claimersList?.length > 2 ? claimersList?.slice(1, 5) : claimersList;
  }, [claimersList]);

  const isShowAndSymbol =
    claimersList?.length &&
    claimersList?.length - slicedClaimersList?.length > 0;

  const remainingClaimers = claimersList?.length - slicedClaimersList?.length;
  if (!claimersList || claimersList?.length <= 1) return null;
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
        <Text tw="ml-1.5 flex-1 text-sm text-gray-900 dark:text-white">
          <>
            {isShowAndSymbol ? `& ` : ""}
            <StockText
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
              {`${remainingClaimers > 0 ? remainingClaimers : ""} collected`}
            </StockText>
          </>
        </Text>
      </>
    </View>
  );
};
