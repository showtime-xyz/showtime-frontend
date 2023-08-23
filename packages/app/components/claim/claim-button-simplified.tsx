import { useContext, useMemo, memo } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import { ClaimContext } from "app/context/claim-context";
import { useClaimDrop } from "app/hooks/use-claim-drop";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";

import { ClaimPaidNFTButton } from "./claim-paid-nft-button";
import { ClaimStatus, getClaimStatus } from "./claim-status";

type ClaimButtonProps = {
  edition?: CreatorEditionResponse;
  tw?: string;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
};

export const ClaimButtonSimplified = memo(
  ({ edition, tw = "", loading, ...rest }: ClaimButtonProps) => {
    const isDark = useIsDarkMode();
    const { state: claimStates, contractAddress } = useContext(ClaimContext);
    const { handleClaimNFT } = useClaimDrop(edition);
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

    if (loading) {
      return <Skeleton width={96} height={24} radius={999} show tw={tw} />;
    }
    if (
      isPaidGated &&
      status !== ClaimStatus.Expired &&
      status !== ClaimStatus.Soldout
    ) {
      return (
        <ClaimPaidNFTButton edition={edition} type="trending" side="bottom" />
      );
    }
    return (
      <PressableHover
        tw={["h-6 w-24 items-center justify-center rounded-full", tw]}
        disabled={disabled}
        onPress={() => handleClaimNFT()}
        style={{
          backgroundColor: buttonBgColor,
        }}
        {...rest}
      >
        <Text tw="text-xs font-bold" style={{ color: buttonTextColor }}>
          {buttonText}
        </Text>
      </PressableHover>
    );
  }
);

ClaimButtonSimplified.displayName = "ClaimButtonSimplified";
