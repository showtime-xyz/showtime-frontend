import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useUser } from "app/hooks/use-user";

export const useRedirectToClaimDrop = () => {
  const { isAuthenticated } = useUser();
  const router = useRouter();

  const redirectToClaimDrop = (
    editionContractAddress: string,
    password?: string
  ) => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      const as = `/claim/${editionContractAddress}`;

      router.push(
        Platform.select({
          native: as,
          web: {
            pathname: router.pathname,
            query: {
              ...router.query,
              contractAddress: editionContractAddress,
              password,
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
    }
  };

  return redirectToClaimDrop;
};
