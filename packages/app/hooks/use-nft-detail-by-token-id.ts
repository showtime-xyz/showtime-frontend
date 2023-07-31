import { useMemo } from "react";

import useSWR from "swr";
import { useSWRConfig } from "swr";

import { axios } from "app/lib/axios";
import { CHAIN_IDENTIFIERS } from "app/lib/constants";
import type { NFT } from "app/types";

type UseNFTDetailByTokenIdParams = {
  contractAddress?: string;
  tokenId?: string;
  chainName?: string;
};

type Data = {
  item: NFT;
};

export type NFTDetailPayload = {
  data: Data;
};

export const useNFTDetailByTokenId = (params: UseNFTDetailByTokenIdParams) => {
  const { mutate } = useSWRConfig();

  const endpoint = useMemo(
    () =>
      params.tokenId && params.contractAddress
        ? `/v2/token/${params.contractAddress}/${params.tokenId}${
            params.chainName
              ? //@ts-ignore
                `?chain_identifier=${CHAIN_IDENTIFIERS[params.chainName]}`
              : ""
          }`
        : "",
    [params.chainName, params.contractAddress, params.tokenId]
  );

  const queryState = useSWR<NFTDetailPayload>(
    endpoint,
    (url) => axios({ url, method: "GET" }),
    {
      revalidateIfStale: false,
      focusThrottleInterval: 30000,
      dedupingInterval: 30000,
    }
    // { suspense: true }
  );
  const mutateNFT = () => {
    mutate(
      endpoint,
      (data: any) => {
        if (data) {
          return {
            data: {
              item: {
                ...data.data.item,
              },
            },
          };
        }
      },
      { optimisticData: true, revalidate: true, populateCache: true }
    );
  };
  return { ...queryState, mutateNFT };
};
