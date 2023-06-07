import { useContext, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { formatDistanceToNowStrict } from "date-fns";

import { ButtonProps } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Spotify,
  Check,
  Hourglass,
  PreAddAppleMusic,
} from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ClaimContext } from "app/context/claim-context";
import { useAppleMusicGatedClaim } from "app/hooks/use-apple-music-gated-claim";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";
import { useRedirectToRaffleResult } from "app/hooks/use-redirect-to-raffle-result";
import { useSpotifyGatedClaim } from "app/hooks/use-spotify-gated-claim";
import { useUser } from "app/hooks/use-user";
import { Analytics, EVENTS } from "app/lib/analytics";

import { toast } from "design-system/toast";

import { ClaimStatus, getClaimStatus } from "./claim-button";

type ClaimButtonProps = {
  edition: CreatorEditionResponse;
  tw?: string;
  style?: StyleProp<ViewStyle>;
};

export const ClaimButtonSimplified = ({
  edition,
  tw = "",
  ...rest
}: ClaimButtonProps) => {
  const isDark = useIsDarkMode();
  const { claimAppleMusicGatedDrop, isMutating: isAppleMusicCollectLoading } =
    useAppleMusicGatedClaim(edition.creator_airdrop_edition);
  const redirectToClaimDrop = useRedirectToClaimDrop();
  const { state: claimStates, dispatch } = useContext(ClaimContext);
  const { claimSpotifyGatedDrop, isMutating: isSpotifyCollectLoading } =
    useSpotifyGatedClaim(edition.creator_airdrop_edition);
  const { isAuthenticated, user } = useUser();

  const handleCollectPress = (type: "free" | "appleMusic" | "spotify") => {
    if (
      claimStates.status === "loading" &&
      claimStates.signaturePrompt === false
    ) {
      toast("Please wait for the previous collect to complete.");
      return;
    }
    dispatch({ type: "initial" });

    if (
      (edition.gating_type === "spotify_presave" ||
        edition.gating_type === "spotify_save" ||
        edition?.gating_type === "music_presave" ||
        edition.gating_type === "multi_provider_music_save" ||
        edition.gating_type === "multi_provider_music_presave") &&
      !isAuthenticated
    ) {
      if (type === "spotify") {
        Analytics.track(EVENTS.SPOTIFY_SAVE_PRESSED_BEFORE_LOGIN);
        claimSpotifyGatedDrop({});
      } else if (type === "appleMusic") {
        Analytics.track(EVENTS.APPLE_MUSIC_SAVE_PRESSED_BEFORE_LOGIN);
        claimAppleMusicGatedDrop({});
      }
    } else {
      redirectToClaimDrop(
        edition.creator_airdrop_edition.contract_address,
        type
      );
    }
  };

  const status = getClaimStatus(edition);

  const buttonBgColor = useMemo(() => {
    if (status === ClaimStatus.Expired) {
      return colors.green[600];
    }
    if (status === ClaimStatus.Claimed) {
      return colors.green[500];
    }
    return isDark ? colors.white : colors.gray[900];
  }, [isDark, status]);

  const buttonTextColor = useMemo(() => {
    if (status === ClaimStatus.Expired) {
      return colors.white;
    }
    if (status === ClaimStatus.Claimed) {
      return colors.white;
    }
    return isDark ? colors.gray[900] : colors.white;
  }, [isDark, status]);
  const buttonText = useMemo(() => {
    if (status === ClaimStatus.Expired) {
      return "Sold out";
    }
    if (status === ClaimStatus.Claimed) {
      return "Collected";
    }
    return "Collect";
  }, [status]);

  return (
    <PressableScale
      tw={["h-5 items-center justify-center rounded-full px-4", tw]}
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
