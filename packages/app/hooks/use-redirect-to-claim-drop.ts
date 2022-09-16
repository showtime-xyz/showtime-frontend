import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useUser } from "app/hooks/use-user";

export const useRedirectToClaimDrop = () => {
  const { isAuthenticated } = useUser();
  const router = useRouter();

  const redirectToClaimDrop = (edition: CreatorEditionResponse) => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      const as = `/claim/${edition.creator_airdrop_edition.contract_address}`;

      router.push(
        Platform.select({
          native: as,
          web: {
            pathname: router.pathname,
            query: {
              ...router.query,
              contractAddress:
                edition?.creator_airdrop_edition.contract_address,
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
