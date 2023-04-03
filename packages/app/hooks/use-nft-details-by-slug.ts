import useSWR from "swr";

import { axios } from "app/lib/axios";

import { NFTDetailPayload } from "./use-nft-detail-by-token-id";

export const useNFTDetailBySlug = (params: {
  username?: string;
  dropSlug?: string;
}) => {
  const queryState = useSWR<NFTDetailPayload>(
    params.username && params.dropSlug
      ? `/v2/nft/${params.username}/${params.dropSlug}`
      : null,
    (url) => axios({ url, method: "GET" })
    // { suspense: true }
  );

  return queryState;
};
