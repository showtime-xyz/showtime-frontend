import { useClaimNFT } from "app/hooks/use-claim-nft";
import { IEdition } from "app/types";

import { Button, View } from "design-system";

import { PolygonScanButton } from "./polygon-scan-button";

export const ClaimButton = ({ edition }: { edition: IEdition }) => {
  const { state, claimNFT } = useClaimNFT();
  return (
    <>
      <Button
        disabled={state.status === "loading"}
        tw={state.status === "loading" ? "opacity-45" : ""}
        onPress={() => claimNFT({ editionAddress: edition.contract_address })}
      >
        {state.status === "loading"
          ? "Claiming..."
          : state.status === "error"
          ? "Failed. Retry!"
          : "Claim"}
      </Button>
      <View tw="mt-4">
        <PolygonScanButton transactionHash={state.transactionHash} />
      </View>
    </>
  );
};
