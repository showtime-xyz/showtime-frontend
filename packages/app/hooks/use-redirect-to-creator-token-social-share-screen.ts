import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

export const useRedirectToCreatorTokenSocialShare = () => {
  const router = useRouter();

  const redirectToCreatorTokenSocialShare = async (username?: string) => {
    const as = `/creator-token/${username}/social-share`;

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            username,
            creatorTokenSocialShareModal: true,
          },
        } as any,
      }),
      Platform.select({ native: as, web: router.asPath }),
      {
        shallow: true,
      }
    );
  };

  return redirectToCreatorTokenSocialShare;
};
