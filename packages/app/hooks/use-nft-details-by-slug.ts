import useSWR from "swr";

import { axios } from "app/lib/axios";
import { NFT } from "app/types";

export const useNFTDetailBySlug = (params: {
  username?: string;
  dropSlug?: string;
}) => {
  const queryState = useSWR<NFT>(
    params.username && params.dropSlug
      ? `/v2/nft/${params.username}/${params.dropSlug}`
      : null,
    (url) => axios({ url, method: "GET" })
    // { suspense: true }
  );

  return queryState;
};
