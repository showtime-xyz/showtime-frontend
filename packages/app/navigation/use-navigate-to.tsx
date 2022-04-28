import { Platform } from "react-native";

import { NFT } from "app/types";

import { useRouter } from "./use-router";

export const useNavigateToListing = () => {
  const router = useRouter();

  const navigateToList = (nft: NFT) => {
    const nftId = nft.nft_id;
    const as = `/nft/${nftId}/list`;

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: { ...router.query, listModal: true, id: nftId },
        },
      }),
      as,
      { shallow: true }
    );
  };

  return navigateToList;
};

export const useNavigateToBuy = () => {
  const router = useRouter();

  const navigateToBuy = (nft: NFT) => {
    const nftId = nft.nft_id;
    const as =  `nft/${nft.chain_name}/${nft.contract_address}/${nft.token_id}/buy`

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: { ...router.query, buyModal: true, id: nftId },
        },
      }),
      as,
      { shallow: true }
    );
  };

  return navigateToBuy;
};
