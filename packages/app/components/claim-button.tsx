import { useClaimNFT } from "app/hooks/use-claim-nft";
import { NFT } from "app/types";

import { Button } from "design-system";

export const ClaimButton = (nft: NFT) => {
  const { state, claimNFT } = useClaimNFT();
  console.log("hello world", nft, state);
  return (
    <Button onPress={() => claimNFT({ editionAddress: "wdde" })}>Claim</Button>
  );
};
