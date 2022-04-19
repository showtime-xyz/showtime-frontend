import { formatDistanceToNowStrict } from "date-fns";
import useSWR from "swr";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { supportedVideoExtensions } from "app/hooks/use-mint-nft";
import { axios } from "app/lib/axios";
import { NFT } from "app/types";
import { findAddressInOwnerList } from "app/utilities";

import { View, Text } from "design-system";
import { Owner } from "design-system/card";
import { Collection } from "design-system/card/rows/collection";
import { PolygonScan } from "design-system/icon";
import { Image } from "design-system/image";
import { tw } from "design-system/tailwind";
import { Video } from "design-system/video";

import { UnlistingSubmit } from "./unlisting-submit";
import { UnlistingTitle } from "./unlisting-title";
import { UnlistingUnavailable } from "./unlisting-unavailable";

type Props = {
  nftId?: string;
};

type NFT_Detail = {
  data: NFT;
};

const UnlistingCard = (props: Props) => {
  const nftId = props.nftId;
  const endpoint = nftId ? `/v2/nft_detail/${nftId}` : undefined;

  const { userAddress: address } = useCurrentUserAddress();

  const { data, error } = useSWR<NFT_Detail>(endpoint, (url) =>
    axios({ url, method: "GET" })
  );

  const isLoading = !data;
  const nft = data?.data;
  const listingId = nft?.listing?.sale_identifier;

  if (error) {
    console.log(`Error in Unlisting Card From Endpoint ${endpoint}:`, error);
  }

  if (isLoading) {
    // TODO: Explore skeleton screens, not high priority as endpoint is cached by this flow
    console.log(
      `Loading in Unlisting Card From Endpoint ${endpoint}:`,
      isLoading
    );
  }

  const hasMultipleOwners = nft?.multiple_owners_list
    ? nft?.multiple_owners_list.length > 1
    : false;

  const isActiveAddressAnOwner = Boolean(
    findAddressInOwnerList(address, nft?.multiple_owners_list)
  );

  const fileExtension = nft?.token_img_url?.split(".").pop();
  const isVideo =
    fileExtension && supportedVideoExtensions.includes(fileExtension);
  const Preview = isVideo ? Video : Image;
  const previewURI = nft?.token_img_url;

  return (
    <View tw="flex-1">
      <UnlistingTitle />
      <Collection nft={nft} />
      <View tw="p-4">
        <View tw="flex-row items-center">
          {previewURI ? (
            <Preview
              source={{
                uri: previewURI,
              }}
              tw="w-[80px] h-[80px] rounded-2xl"
            />
          ) : null}
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
          <UnlistingSubmit listingID={listingId} />
        ) : (
          <UnlistingUnavailable nft={nft} />
        )}
      </View>
    </View>
  );
};

export { UnlistingCard };
