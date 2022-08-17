import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { ButtonProps } from "@showtime-xyz/universal.button/types";
import { Check } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";

import { ClaimStatus, getClaimStatus } from ".";

type ClaimButtonProps = {
  edition: CreatorEditionResponse;
  size?: ButtonProps["size"];
};
export const ClaimButton = ({ edition, size = "small" }: ClaimButtonProps) => {
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

  const status = getClaimStatus(edition);

  const bgIsGreen =
    status === ClaimStatus.Claimed || status === ClaimStatus.Soldout;

  const disabled =
    status === ClaimStatus.Claimed ||
    status === ClaimStatus.Soldout ||
    isExpired;

  return (
    <Button
      onPress={onClaimPress}
      disabled={disabled}
      style={bgIsGreen ? { backgroundColor: "#0CB504" } : undefined}
      size={size}
      tw={isExpired && !bgIsGreen ? "opacity-50" : ""}
    >
      {status === ClaimStatus.Claimed ? (
        <View tw="w-auto flex-row items-center">
          <Check color="white" width={18} height={18} />
          <Text tw="ml-1 text-white">Claimed</Text>
        </View>
      ) : status === ClaimStatus.Soldout ? (
        <View tw="w-auto flex-row items-center">
          <Check color="white" width={18} height={18} />
          <Text tw="ml-1 text-white">Sold out</Text>
        </View>
      ) : status === ClaimStatus.Expired ? (
        "Drop expired"
      ) : (
        "Claim for free"
      )}
    </Button>
  );
};
