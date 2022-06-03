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

  const status =
    edition &&
    edition.total_claimed_count?.toString() ===
      edition.creator_airdrop_edition?.edition_size.toString()
      ? "soldout"
      : edition.is_already_claimed
      ? "claimed"
      : undefined;

  const disabled = status === "claimed" || status === "soldout";

  return (
    <Button
      onPress={onClaimPress}
      disabled={disabled}
      tw={disabled ? "opacity-50" : ""}
    >
      {status === "claimed"
        ? "Claimed ✓"
        : status === "soldout"
        ? "Sold out"
        : "Claim for free"}
    </Button>
  );
};
