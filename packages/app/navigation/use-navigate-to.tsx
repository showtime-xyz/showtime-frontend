import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { NFT } from "app/types";

export const useNavigateToLogin = () => {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push(
      Platform.select({
        native: "/login",
        // @ts-ignore
        web: {
          pathname: router.pathname,
          query: { ...router.query, loginModal: true },
        },
      }),
      Platform.select({
        native: "/login",
        web: router.asPath === "/" ? "/login" : router.asPath,
      }),
      { shallow: true }
    );
  };

  return navigateToLogin;
};

export const useNavigateToListing = () => {
  const router = useRouter();

  const navigateToList = (nft: NFT) => {
    const as = `/nft/${nft.chain_name}/${nft.contract_address}/${nft.token_id}/list`;

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
      Platform.select({
        native: as,
        web: router.asPath.startsWith("/nft/") ? as : router.asPath,
      }),
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
