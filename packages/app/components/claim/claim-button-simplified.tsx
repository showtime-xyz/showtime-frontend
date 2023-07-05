import { useContext, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import { ClaimContext } from "app/context/claim-context";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";

import { toast } from "design-system/toast";

import { ClaimStatus, getClaimStatus } from "./claim-button";

type ClaimButtonProps = {
  edition?: CreatorEditionResponse;
  tw?: string;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
};

export const ClaimButtonSimplified = ({
  edition,
  tw = "",
  loading,
  ...rest
}: ClaimButtonProps) => {
  const isDark = useIsDarkMode();
  const redirectToClaimDrop = useRedirectToClaimDrop();
  const { state: claimStates, dispatch } = useContext(ClaimContext);

  const handleCollectPress = (type: "free" | "appleMusic" | "spotify") => {
    if (
      claimStates.status === "loading" &&
      claimStates.signaturePrompt === false
    ) {
      toast("Please wait for the previous collect to complete.");
      return;
    }
    dispatch({ type: "initial" });
    if (edition) {
      redirectToClaimDrop(
        edition.creator_airdrop_edition.contract_address,
        type
      );
    }
  };

  const status = getClaimStatus(edition);

  const buttonBgColor = useMemo(() => {
    if (status === ClaimStatus.Expired) {
      return isDark ? colors.gray[800] : colors.gray[100];
    }
    if (status === ClaimStatus.Soldout) {
      return isDark ? colors.gray[800] : colors.gray[100];
    }
    if (status === ClaimStatus.Claimed) {
      return colors.green[500];
    }

    return isDark ? colors.white : colors.gray[900];
  }, [isDark, status]);

  const buttonTextColor = useMemo(() => {
    if (status === ClaimStatus.Expired) {
      return colors.gray[400];
    }
    if (status === ClaimStatus.Soldout) {
      return "#E40000";
    }
    if (status === ClaimStatus.Claimed) {
      return colors.white;
    }
    return isDark ? colors.gray[900] : colors.white;
  }, [isDark, status]);
  const buttonText = useMemo(() => {
    if (status === ClaimStatus.Expired) {
      return "Expired";
    }
    if (status === ClaimStatus.Soldout) {
      return "Sold out";
    }
    if (status === ClaimStatus.Claimed) {
      return "Collected";
    }
    return "Collect";
  }, [status]);
  const disabled = useMemo(
    () =>
      status === ClaimStatus.Expired ||
      status === ClaimStatus.Claimed ||
      status === ClaimStatus.Soldout,
    [status]
  );
  if (loading) {
    return <Skeleton width={96} height={24} radius={999} show tw={tw} />;
  }
  return (
    <PressableScale
      tw={["h-6 w-24 items-center justify-center rounded-full", tw]}
      disabled={disabled}
      onPress={() => {
        let type: "free" | "appleMusic" | "spotify" = "free";
        if (edition?.gating_type === "spotify_save") {
          type = "spotify";
        } else if (edition?.gating_type === "multi_provider_music_presave") {
          type = edition?.creator_spotify_id ? "spotify" : "appleMusic";
        } else if (edition?.gating_type === "multi_provider_music_save") {
          type = edition?.spotify_track_url ? "spotify" : "appleMusic";
        } else if (
          edition?.gating_type === "music_presave" ||
          edition?.gating_type === "spotify_presave"
        ) {
          type = "spotify";
        }
        handleCollectPress(type);
      }}
      style={{
        backgroundColor: buttonBgColor,
      }}
      {...rest}
    >
      <Text tw="text-xs font-bold" style={{ color: buttonTextColor }}>
        {buttonText}
      </Text>
    </PressableScale>
  );
};
