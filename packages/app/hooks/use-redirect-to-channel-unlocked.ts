import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

export const useRedirectToChannelUnlocked = () => {
  const router = useRouter();

  const redirectToChannelUnlocked = async (
    channelId: string | number,
    contractAddress?: string
  ) => {
    const as = `/channels/${channelId}/${contractAddress}/unlocked`;
    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            channelId,
            contractAddress,
            unlockedChannelModal: true,
          },
        } as any,
      }),
      Platform.select({ native: as, web: router.asPath }),
      {
        shallow: true,
      }
    );
  };

  return redirectToChannelUnlocked;
};
