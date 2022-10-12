import useSWR from "swr";

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
  const queryState = useSWR<NFTDetailPayload>(
    params.tokenId && params.contractAddress
      ? `/v2/token/${params.contractAddress}/${params.tokenId}${
          params.chainName
            ? //@ts-ignore
              `?chain_identifier=${CHAIN_IDENTIFIERS[params.chainName]}`
            : ""
        }`
      : null,
    (url) => axios({ url, method: "GET" })
    // { suspense: true }
  );

  return queryState;
};
