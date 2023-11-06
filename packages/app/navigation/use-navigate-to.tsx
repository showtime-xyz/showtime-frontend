import { Platform } from "react-native";

import { usePrivy } from "@privy-io/react-auth";

import { useRouter } from "@showtime-xyz/universal.router";

import { NFT } from "app/types";

export const useNavigateToLogin = () => {
  const privy = usePrivy();

  const navigateToLogin = async () => {
    if (privy.authenticated) {
      await privy.logout();
    }
    privy.login();
  };

  return navigateToLogin;
};

type NavigateToOnboardingParams = {
  replace?: boolean;
};

export const useNavigateToOnboarding = () => {
  const router = useRouter();
  const navigateToOnboarding = (params?: NavigateToOnboardingParams) => {
    if (params?.replace) {
      router.replace("/profile/onboarding");
    } else {
      // TODO: rewrite the way we handle modals, if we don't remove the below param, login modal will stay mounted
      delete router.query.loginModal;
      router.push(
        Platform.select({
          native: "/profile/onboarding",
          web: {
            pathname: router.pathname,
            query: {
              ...router.query,
              onboardingModal: true,
            },
          } as any,
        }),
        Platform.select({
          native: "/profile/onboarding",
          web: router.asPath,
        })
      );
    }
  };

  return navigateToOnboarding;
};

export const useNavigateToListing = () => {
  const router = useRouter();

  const navigateToList = (nft: NFT) => {
    const as = `/nft/${nft.chain_name}/${nft.contract_address}/${nft.token_id}/list`;

    router.push(
      Platform.select({
        native: as,
        // @ts-ignore
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
        // @ts-ignore
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
