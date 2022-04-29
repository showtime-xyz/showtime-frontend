import { Platform } from "react-native";

import { NFT } from "app/types";

import { useRouter } from "./use-router";

export const useNavigateToListing = () => {
  const router = useRouter();

  const navigateToList = (nft: NFT) => {
    const as = `nft/${nft.chain_name}/${nft.contract_address}/${nft.token_id}/buy`;

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          web: {
            pathname: router.pathname,
            query: {
              ...router.query,
              chainName: nft?.chain_name,
              contractAddress: nft?.contract_address,
              tokenId: nft?.token_id,
              listModal: true,
            },
          },
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
    const as = `/nft/${nft.chain_name}/${nft.contract_address}/${nft.token_id}/buy`;

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            chainName: nft?.chain_name,
            contractAddress: nft?.contract_address,
            tokenId: nft?.token_id,
            buyModal: true,
          },
        },
      }),
      Platform.select({
        native: as,
        web: router.asPath.startsWith("/nft/") ? as : router.asPath,
      }),
      { shallow: true }
    );
  };

  return navigateToBuy;
};
