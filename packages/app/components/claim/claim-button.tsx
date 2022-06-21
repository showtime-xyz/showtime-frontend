import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Check } from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

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

  let isExpired = false;
  if (typeof edition?.time_limit === "string") {
    isExpired = new Date() > new Date(edition.time_limit);
  }

  const status =
    edition &&
    edition.total_claimed_count ===
      edition.creator_airdrop_edition?.edition_size
      ? "soldout"
      : edition.is_already_claimed
      ? "claimed"
      : isExpired
      ? "expired"
      : undefined;

  const bgIsGreen = status === "claimed" || status === "soldout";

  const disabled = status === "claimed" || status === "soldout" || isExpired;

  return (
    <Button
      onPress={onClaimPress}
      disabled={disabled}
      style={bgIsGreen ? { backgroundColor: "#0CB504" } : undefined}
      tw={isExpired && !bgIsGreen ? "opacity-50" : ""}
    >
      {status === "claimed" ? (
        <View tw="flex-row items-center">
          <Check color="white" width={18} height={18} />
          <Text tw="ml-1 text-white">Claimed</Text>
        </View>
      ) : status === "soldout" ? (
        <View tw="flex-row items-center">
          <Check color="white" width={18} height={18} />
          <Text tw="ml-1 text-white">Sold out</Text>
        </View>
      ) : status === "expired" ? (
        "Drop expired"
      ) : (
        "Claim for free"
      )}
    </Button>
  );
};
