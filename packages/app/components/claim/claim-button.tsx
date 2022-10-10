import { useContext } from "react";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { ButtonProps } from "@showtime-xyz/universal.button/types";
import { Check } from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";

import { ClaimContext } from "app/context/claim-context";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";

import { ClaimStatus, getClaimStatus } from ".";

type ClaimButtonProps = {
  edition: CreatorEditionResponse;
  size?: ButtonProps["size"];
};
export const ClaimButton = ({ edition, size = "small" }: ClaimButtonProps) => {
  const redirectToClaimDrop = useRedirectToClaimDrop();
  const { state: claimStates } = useContext(ClaimContext);
  const Alert = useAlert();
  const isProgress =
    claimStates.status === "loading" && claimStates.signaturePrompt === false;

  const onClaimPress = () => {
    if (isProgress) {
      return Alert.alert(
        "You currently have a transaction in progress, please wait to complete it and try again!"
      );
    }
    redirectToClaimDrop(edition.creator_airdrop_edition.contract_address);
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
        <>
          <Check color="white" width={18} height={18} />
          <Text tw="ml-1 font-semibold text-white">Claimed</Text>
        </>
      ) : status === ClaimStatus.Soldout ? (
        <>
          <Check color="white" width={18} height={18} />
          <Text tw="ml-1 font-semibold text-white">Sold out</Text>
        </>
      ) : status === ClaimStatus.Expired ? (
        "Drop expired"
      ) : isProgress ? (
        "Claim in progress"
      ) : (
        "Claim for free"
      )}
    </Button>
  );
};
