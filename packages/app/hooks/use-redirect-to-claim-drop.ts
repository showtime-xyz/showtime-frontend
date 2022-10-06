import { Alert, Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useUser } from "app/hooks/use-user";
import { useClaimNFT } from "app/providers/claim-provider";

export const useRedirectToClaimDrop = () => {
  const { isAuthenticated } = useUser();
  const router = useRouter();
  const { state, resetState } = useClaimNFT();

  const redirectToClaimDrop = (editionContractAddress: string) => {
    if (state.status === "loading") {
      Alert.alert("A transaction is already in progress");
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    resetState();

    const as = `/claim/${editionContractAddress}`;

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            contractAddress: editionContractAddress,
            claimModal: true,
          },
        } as any,
      }),
      Platform.select({
        native: as,
        web: router.asPath,
      }),
      { shallow: true }
    );
  };

  return redirectToClaimDrop;
};
