import { formatDistanceToNowStrict } from "date-fns";

import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { PolygonScanButton } from "app/components/polygon-scan-button";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useListNFT } from "app/hooks/use-list-nft";
import { useUser } from "app/hooks/use-user";
import type { NFT } from "app/types";
import { findAddressInOwnerList } from "app/utilities";

import { Media, Spinner } from "design-system";
import { Owner } from "design-system/card";
import { Collection } from "design-system/card/rows/collection";
import { PolygonScan } from "design-system/icon";

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
      <View tw="mt-4 flex-1 items-center justify-center p-8">
        <Text tw="text-4xl">🎉</Text>
        <View>
          <View tw="my-8">
            <Text tw="font-space-bold text-center text-lg text-black dark:text-white">
              Your NFT has been listed on Showtime!
            </Text>
          </View>
          <PolygonScanButton transactionHash={state.transactionHash} />
        </View>
      </View>
    );
  }

  if (state.status === "transactionInitiated") {
    return (
      <View tw="flex-1 items-center justify-center p-8">
        <Spinner />
        <View tw="items-center">
          <View tw="h-8" />
          <Text tw="text-center text-base text-black dark:text-white">
            Your NFT is being listed on Showtime. Feel free to navigate away
            from this screen.
          </Text>
          <View tw="h-8" />
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
          <Media item={nft} tw="h-[80px] w-[80px] rounded-2xl" />
          <View tw="flex-1 px-4">
            <Text tw="font-space-bold text-lg text-black dark:text-white">
              {nft?.token_name}
            </Text>
            <View tw="h-2" />
            <View tw="flex-row items-center">
              <PolygonScan
                width={14}
                height={14}
                color={tw.style("text-gray-500").color as string}
              />
              {nft?.token_created ? (
                <Text tw="pl-1 text-xs font-bold text-gray-500">
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
        <Owner nft={nft} price={!hasMultipleOwners} tw="my-4 px-0" />
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
