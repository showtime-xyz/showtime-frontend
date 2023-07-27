import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { NFT } from "app/types";

export const useRedirectToStarDropShareScreen = (
  nft: NFT | null | undefined
) => {
  const router = useRouter();
  const redirectToStarDropShareScreen = () => {
    const as = `/nft/${nft?.chain_name}/${nft?.contract_address}/${nft?.token_id}/share`;
    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            contractAddress: nft?.contract_address,
            tokenId: nft?.token_id,
            chainName: nft?.chain_name,
            dropViewShareModal: true,
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

  return redirectToStarDropShareScreen;
};
