import { useContext } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { ButtonProps } from "@showtime-xyz/universal.button/types";

import { ClaimContext } from "app/context/claim-context";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";

type ClaimedShareButtonProps = {
  edition: CreatorEditionResponse;
  size?: ButtonProps["size"];
  tw?: string;
  style?: StyleProp<ViewStyle>;
};

export const ClaimedShareButton = ({
  edition,
  size = "small",
  tw = "",
  style,
}: ClaimedShareButtonProps) => {
  const redirectToClaimDrop = useRedirectToClaimDrop();
  const { dispatch } = useContext(ClaimContext);

  const onClaimPress = () => {
    redirectToClaimDrop(edition.creator_airdrop_edition.contract_address);
    dispatch({
      type: "share",
    });
  };

  if (!edition.is_already_claimed) return null;
  return (
    <Button onPress={onClaimPress} size={size} style={style} tw={tw}>
      Share
    </Button>
  );
};
