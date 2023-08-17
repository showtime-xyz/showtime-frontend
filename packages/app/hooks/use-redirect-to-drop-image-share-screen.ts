import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { DropImageShareType } from "app/components/qr-code/qr-code-modal";

export const useRedirectDropImageShareScreen = () => {
  const router = useRouter();
  const redirectToDropImageShareScreen = (
    contractAddress: string | null | undefined,
    shareType?: DropImageShareType
  ) => {
    const as = `/drop-image-share/${contractAddress}?shareType=${shareType}`;
    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            contractAddress: contractAddress,
            dropImageShareModal: true,
            shareType,
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
