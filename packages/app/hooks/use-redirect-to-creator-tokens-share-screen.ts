import { useCallback } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

export const useRedirectToCreatorTokensShare = () => {
  const router = useRouter();
  const redirectToCreatorTokensShare = useCallback(
    async (username: string) => {
      const as = `/creator-tokens/${username}/share`;
      router.push(
        Platform.select({
          native: as,
          web: {
            pathname: router.pathname,
            query: {
              ...router.query,
              username,
              creatorTokensShareModal: true,
            },
          } as any,
        }),
        Platform.select({ native: as, web: router.asPath }),
        {
          shallow: true,
        }
      );
    },
    [router]
  );

  return redirectToCreatorTokensShare;
};
