import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useRouter } from "app/navigation/use-router";

export const ClaimButton = ({
  edition,
}: {
  edition: CreatorEditionResponse;
}) => {
  const router = useRouter();

  console.log("edition ", edition);

  const onClaimPress = () => {
    const as = `/claim/${edition.creator_airdrop_edition.contract_address}`;

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            contractAddress: edition?.creator_airdrop_edition.contract_address,
            claimModal: true,
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

  return (
    <Button onPress={onClaimPress} disabled={edition.is_already_claimed}>
      {edition.is_already_claimed ? "Already claimed" : "Claim for free"}
    </Button>
  );
};
