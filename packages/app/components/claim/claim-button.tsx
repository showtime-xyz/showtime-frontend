import { useContext, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { ButtonProps } from "@showtime-xyz/universal.button/types";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Check, Hourglass } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import { ClaimContext } from "app/context/claim-context";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";

import { ThreeDotsAnimation } from "design-system/three-dots";

type ClaimButtonProps = {
  edition: CreatorEditionResponse;
  size?: ButtonProps["size"];
  tw?: string;
  style?: StyleProp<ViewStyle>;
};

export enum ClaimStatus {
  Soldout,
  Claimed,
  Expired,
  Normal,
}
export const getClaimStatus = (edition: CreatorEditionResponse) => {
  if (!edition) return undefined;
  if (
    edition.total_claimed_count ===
    edition.creator_airdrop_edition?.edition_size
  )
    return ClaimStatus.Soldout;

  if (edition.is_already_claimed) return ClaimStatus.Claimed;

  return typeof edition?.time_limit === "string" &&
    new Date() > new Date(edition.time_limit)
    ? ClaimStatus.Expired
    : ClaimStatus.Normal;
};

export const ClaimButton = ({
  edition,
  size = "small",
  tw = "",
  style,
}: ClaimButtonProps) => {
  const isDark = useIsDarkMode();
  const redirectToClaimDrop = useRedirectToClaimDrop();
  const { state: claimStates, dispatch } = useContext(ClaimContext);
  const isProgress =
    claimStates.status === "loading" && claimStates.signaturePrompt === false;

  const onClaimPress = () => {
    dispatch({ type: "initial" });
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
    isExpired ||
    isProgress;
  const isMusicDrop = edition?.gating_type === "spotify_save";
  const content = useMemo(() => {
    if (status === ClaimStatus.Claimed) {
      return (
        <>
          <Check color="white" width={18} height={18} />
          <Text tw="ml-1 font-semibold text-white">Collected</Text>
        </>
      );
    } else if (status === ClaimStatus.Soldout) {
      return (
        <>
          <Check color="white" width={20} height={20} />
          <Text tw="ml-1 font-semibold text-white">Sold out</Text>
        </>
      );
    } else if (status === ClaimStatus.Expired) {
      return (
        <>
          <Hourglass color="white" width={16} height={16} />
          <Text tw="ml-1 font-semibold text-white">Time out</Text>
        </>
      );
    } else if (isProgress) {
      return (
        <Text tw="font-semibold">
          Collecting
          <ThreeDotsAnimation color={isDark ? colors.black : colors.white} />
        </Text>
      );
    } else {
      return isMusicDrop ? "Save to Collect" : "Collect";
    }
  }, [status, isProgress, isDark, isMusicDrop]);

  const opacityTw = useMemo(() => {
    if (isProgress) {
      return "opacity-50";
    }
    if (isExpired && !bgIsGreen) {
      return "opacity-100";
    }
    return "";
  }, [bgIsGreen, isExpired, isProgress]);

  const backgroundColor = useMemo(() => {
    if (bgIsGreen) {
      return { backgroundColor: "#0CB504" };
    }
    if (isExpired && !bgIsGreen) {
      return { backgroundColor: colors.gray[500] };
    }
    return {};
  }, [bgIsGreen, isExpired]);

  return (
    <Button
      onPress={onClaimPress}
      disabled={disabled}
      style={[backgroundColor, style]}
      size={size}
      tw={[opacityTw, tw]}
    >
      {content}
    </Button>
  );
};
