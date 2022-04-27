import { formatDistanceToNowStrict } from "date-fns";

import { PolygonScanButton } from "app/components/polygon-scan-button";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useListNFT } from "app/hooks/use-list-nft";
import { useUser } from "app/hooks/use-user";
import type { NFT } from "app/types";
import { findAddressInOwnerList } from "app/utilities";

import { Media, Spinner, Text, View } from "design-system";
import { Owner } from "design-system/card";
import { Collection } from "design-system/card/rows/collection";
import { PolygonScan } from "design-system/icon";
import { tw } from "design-system/tailwind";

import { ListingForm } from "./listing-form";
import { ListingUnavailable } from "./listing-unavailable";

type Props = {
  nft?: NFT;
};

const List = ({ nft }: Props) => {
  const { user } = useUser();
  const { userAddress: address } = useCurrentUserAddress();
  const { listNFT, state } = useListNFT();

  const hasMultipleOwners = nft?.multiple_owners_list
    ? nft?.multiple_owners_list.length > 1
    : false;

  const isActiveAddressAnOwner = Boolean(
    findAddressInOwnerList(
      address,
      user?.data.profile.wallet_addresses_v2,
      nft?.multiple_owners_list
    )
  );

  if (state.status === "listingSuccess") {
    return (
      <View tw="flex-1 items-center justify-center mt-4">
        <Text variant="text-4xl">🎉</Text>
        <View>
          <Text
            variant="text-lg"
            tw="my-8 text-black dark:text-white text-center"
          >
            Your NFT has been listed on Showtime!
          </Text>
          <PolygonScanButton transactionHash={state.transactionHash} />
        </View>
      </View>
    );
  }

  if (state.status === "transactionInitiated") {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
        <View tw="items-center">
          <Text
            variant="text-base"
            tw="text-black dark:text-white text-center my-8"
          >
            Your NFT is being listed on Showtime. Feel free to navigate away
            from this screen.
          </Text>
          <PolygonScanButton transactionHash={state.transactionHash} />
        </View>
      </View>
    );
  }

  return (
    <View tw="flex-1">
      <Collection nft={nft} />
      <View tw="p-4">
        <View tw="flex-row items-center">
          <Media item={nft} tw="w-[80px] h-[80px] rounded-2xl" />
          <View tw="flex-1 px-4">
            <Text variant="text-lg" tw=" text-black dark:text-white mb-2">
              {nft?.token_name}
            </Text>
            <View tw="flex-row items-center">
              <PolygonScan
                width={14}
                height={14}
                color={tw.style("text-gray-500").color as string}
              />
              {nft?.token_created ? (
                <Text tw="text-gray-500 font-bold pl-1" variant="text-xs">
                  {`Minted ${formatDistanceToNowStrict(
                    new Date(nft?.token_created),
                    {
                      addSuffix: true,
                    }
                  )}`}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
        <Owner nft={nft} price={!hasMultipleOwners} tw="px-0 my-4" />
        {isActiveAddressAnOwner ? (
          <ListingForm nft={nft} listNFT={listNFT} listState={state} />
        ) : (
          <ListingUnavailable nft={nft} />
        )}
      </View>
    </View>
  );
};

export { List };
