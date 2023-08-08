import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

export const useRedirectDropImageShareScreen = () => {
  const router = useRouter();
  const redirectToDropImageShareScreen = (
    contractAddress: string | null | undefined
  ) => {
    const as = `/drop-image-share/${contractAddress}`;
    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            contractAddress: contractAddress,
            dropImageShareModal: true,
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

  return redirectToDropImageShareScreen;
};
