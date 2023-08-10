import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

export const useRedirectToChannelCongrats = () => {
  const router = useRouter();

  const redirectToChannelCongrats = async (channelId?: string | number) => {
    const as = `/channels/${channelId}/congrats`;
    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            channelId,
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

  return redirectToChannelCongrats;
};
