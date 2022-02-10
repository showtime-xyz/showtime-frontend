import useSWR from "swr";
import { View, Text, Fieldset } from "design-system";
import { Media } from "design-system";
import { useUser } from "app/hooks/use-user";
import { axios } from "app/lib/axios";
import { NFT, OwnersListOwner } from "app/types";
import { Collection } from "design-system/card/rows/collection";
import { PolygonScan } from "design-system/icon";
import { tw } from "design-system/tailwind";
import { formatDistanceToNowStrict } from "date-fns";
import { Owner } from "design-system/card";
import { ListingForm, UnableToList } from "./listing-form";
type Props = {
  nftId?: string;
  address?: string;
};

type NFT_Detail = {
  data: NFT;
};

const ListingCard = (props: Props) => {
  const nftId = props.nftId;
  const address = props.address;
  const endpoint = nftId ? `/v2/nft_detail/${nftId}` : undefined;
  const { user } = useUser();

  const { data, error, mutate } = useSWR<NFT_Detail>(endpoint, (url) =>
    axios({ url, method: "GET" })
  );

  const nft = data?.data;

  if (error) {
    console.log("Listing Error:", error);
  }

  const isLoading = !data;

  if (isLoading) {
    // TODO: Skeleton Screens?
  }

  // isOwner = a address matches this account
  // isActiveAddress = the connected address owns this nft
  // TODO: Memo + Hook
  const owner = nft?.multiple_owners_list.reduce(
    (
      previousOwnerAccumulator: {
        isOwner: boolean;
        ownerList: OwnersListOwner[];
        isActiveAddressOwner: boolean;
        activeOwnerListItem?: OwnersListOwner;
        cycled: boolean;
      },
      ownersListItem
    ) => {
      previousOwnerAccumulator.cycled = true;
      const alreadyMatched = previousOwnerAccumulator.isActiveAddressOwner;

      if (alreadyMatched) {
        previousOwnerAccumulator.ownerList.push(ownersListItem);
        return previousOwnerAccumulator;
      }

      const isActiveAddressOwner =
        ownersListItem.address.toLowerCase() === address?.toLowerCase();

      if (isActiveAddressOwner) {
        previousOwnerAccumulator.isOwner = true;
        previousOwnerAccumulator.isActiveAddressOwner = true;
        previousOwnerAccumulator.ownerList.push(ownersListItem);
        previousOwnerAccumulator.activeOwnerListItem = ownersListItem;
        return previousOwnerAccumulator;
      }

      const isOwner = user?.data.profile.wallet_addresses_v2.find(
        (wallet) =>
          wallet.address.toLowerCase() === ownersListItem.address?.toLowerCase()
      );
      if (isOwner) {
        previousOwnerAccumulator.isOwner = true;
        previousOwnerAccumulator.ownerList.push(ownersListItem);
        return previousOwnerAccumulator;
      }

      return previousOwnerAccumulator;
    },
    {
      isOwner: false,
      ownerList: [],
      isActiveAddressOwner: false,
      activeOwnerListItem: undefined,
      cycled: false,
    }
  );

  const hasMultipleOwners = nft?.multiple_owners_list
    ? nft?.multiple_owners_list.length > 1
    : false;

  // we dont know yet / own none / own sme
  const ownedAmount =
    owner?.activeOwnerListItem && owner?.cycled
      ? owner?.activeOwnerListItem.quantity
      : 0;

  const addressOwnsNone = ownedAmount === 0 && owner?.cycled;

  return (
    <View tw="flex-1">
      <View tw="pb-2 -mx-4">
        <Collection nft={nft} />
      </View>

      {/* Image */}
      <View tw="flex-row items-center">
        <View tw="w-20 h-20 bg-white mr-4 rounded-full">
          <Media item={nft} tw="w-20 h-20" />
        </View>
        <View>
          <Text
            variant="text-lg"
            tw="font-medium text-black dark:text-white mb-2"
          >
            {nft?.token_name}
          </Text>
          <View tw="flex-row items-center">
            <PolygonScan
              width={16}
              height={16}
              color={tw.style("text-gray-500").color as string}
            />
            {nft?.token_created ? (
              <Text variant="text-xs" tw="ml-1 font-bold text-gray-500">
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
      <View tw="-mx-2">
        <Owner nft={nft} toggleCreatorName={true} price={!hasMultipleOwners} />
      </View>
      {/* owns multiple single none split out */}
      {addressOwnsNone ? (
        <UnableToList isOwner={owner?.isOwner} ownerList={owner?.ownerList} />
      ) : null}
      {ownedAmount ? <ListingForm nft={nft} ownedAmount={ownedAmount} /> : null}
    </View>
  );
};

// clean up and huddle

export { ListingCard };
