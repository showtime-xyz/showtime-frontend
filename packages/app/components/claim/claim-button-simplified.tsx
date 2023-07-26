import { useContext, useMemo, memo, useCallback } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ClaimContext } from "app/context/claim-context";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";

import { toast } from "design-system/toast";

import { ClaimStatus, getClaimStatus } from "./claim-button";
import { ClaimType } from "./claim-form";
import { GoldLinearGradient } from "./gold-linear-gradient";

type ClaimButtonProps = {
  edition?: CreatorEditionResponse;
  tw?: string;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
};

export const ClaimButtonSimplified = memo(
  ({ edition, tw = "", loading, ...rest }: ClaimButtonProps) => {
    const isDark = useIsDarkMode();
    const redirectToClaimDrop = useRedirectToClaimDrop();
    const {
      state: claimStates,
      dispatch,
      contractAddress,
    } = useContext(ClaimContext);
    const isPaidGated = edition?.gating_type === "paid_nft";
    const isProgress = useMemo(() => {
      return (
        claimStates.status === "loading" &&
        claimStates.signaturePrompt === false &&
        contractAddress === edition?.creator_airdrop_edition.contract_address
      );
    }, [
      claimStates.signaturePrompt,
      claimStates.status,
      contractAddress,
      edition?.creator_airdrop_edition.contract_address,
    ]);

    const handleCollectPress = useCallback(
      (type: ClaimType) => {
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
      },
      [
        claimStates.signaturePrompt,
        claimStates.status,
        dispatch,
        edition,
        redirectToClaimDrop,
      ]
    );

    const status = useMemo(() => getClaimStatus(edition), [edition]);

    const buttonBgColor = useMemo(() => {
      if (isProgress) {
        return isDark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.5)";
      }
      if (status === ClaimStatus.Expired) {
        return isDark ? colors.gray[800] : colors.gray[100];
      }
      if (status === ClaimStatus.Soldout) {
        return isDark ? colors.gray[800] : colors.gray[100];
      }
      if (status === ClaimStatus.Claimed) {
        return colors.green[500];
      }
      if (isPaidGated) {
        return "transparent";
      }
      return isDark ? colors.white : colors.gray[900];
    }, [isProgress, status, isPaidGated, isDark]);

    const buttonTextColor = useMemo(() => {
      if (isProgress) {
        return isDark ? colors.gray[900] : colors.white;
      }
      if (status === ClaimStatus.Expired) {
        return colors.gray[400];
      }
      if (status === ClaimStatus.Soldout) {
        return "#E40000";
      }
      if (status === ClaimStatus.Claimed) {
        return colors.white;
      }
      if (isPaidGated) {
        return colors.gray[900];
      }
      return isDark ? colors.gray[900] : colors.white;
    }, [isDark, isPaidGated, isProgress, status]);

    const buttonText = useMemo(() => {
      if (isProgress) {
        return "Collecting...";
      }
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
    }, [isProgress, status]);

    const disabled = useMemo(
      () =>
        isProgress ||
        status === ClaimStatus.Expired ||
        status === ClaimStatus.Claimed ||
        status === ClaimStatus.Soldout,
      [status, isProgress]
    );

    const onPress = useCallback(() => {
      let type: ClaimType = "free";
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
    }, [
      edition?.creator_spotify_id,
      edition?.gating_type,
      edition?.spotify_track_url,
      handleCollectPress,
    ]);

    if (loading) {
      return <Skeleton width={96} height={24} radius={999} show tw={tw} />;
    }
    return (
      <PressableScale
        tw={["h-6 w-24 items-center justify-center rounded-full", tw]}
        disabled={disabled}
        onPress={onPress}
        style={{
          backgroundColor: buttonBgColor,
        }}
        {...rest}
      >
        {isPaidGated ? <GoldLinearGradient /> : null}
        <Text tw="text-xs font-bold" style={{ color: buttonTextColor }}>
          {buttonText}
        </Text>
      </PressableScale>
    );
  }
);

ClaimButtonSimplified.displayName = "ClaimButtonSimplified";
