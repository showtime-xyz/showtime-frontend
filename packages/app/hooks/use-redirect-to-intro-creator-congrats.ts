import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

export const useRedirectToCreatorChannelCongrats = () => {
  const router = useRouter();

  const redirectToCreatorChannelCongrats = async () => {
    const as = `/channels/congrats`;
    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            channelsCongratsModal: true,
          },
        } as any,
      }),
      Platform.select({ native: as, web: router.asPath }),
      {
        shallow: true,
      }
    );
  };

  return redirectToCreatorChannelCongrats;
};
