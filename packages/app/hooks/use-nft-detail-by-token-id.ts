import useSWR from "swr";

import { axios } from "app/lib/axios";
import { CHAIN_IDENTIFIERS } from "app/lib/constants";

type UseNFTDetailByTokenIdParams = {
  contractAddress: string;
  tokenId: string;
  chainName: string;
};

export const useNFTDetailByTokenId = (params: UseNFTDetailByTokenIdParams) => {
  const queryState = useSWR(
    `/v2/token/${params.contractAddress}/${params.tokenId}${
      params.chainName
        ? //@ts-ignore
          `?chain_identifier=${CHAIN_IDENTIFIERS[params.chainName]}`
        : ""
    }`,
    (url) => axios({ url, method: "GET" }),
    { suspense: true }
  );

  return queryState;
};
