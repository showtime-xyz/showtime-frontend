import { useContext } from "react";

import { ClaimType } from "app/components/claim/claim-form";
import { ClaimContext } from "app/context/claim-context";
import { Analytics, EVENTS } from "app/lib/analytics";

import { toast } from "design-system/toast";

import { useMyInfo } from "./api-hooks";
import { useAppleMusicGatedClaim } from "./use-apple-music-gated-claim";
import { useClaimNFT } from "./use-claim-nft";
import { CreatorEditionResponse } from "./use-creator-collection-detail";
import { useRedirectToClaimDrop } from "./use-redirect-to-claim-drop";
import { useSpotifyGatedClaim } from "./use-spotify-gated-claim";

export const useClaimDrop = (edition?: CreatorEditionResponse) => {
  const { claimNFT } = useClaimNFT(edition?.creator_airdrop_edition);
  const { claimSpotifyGatedDrop, isMutating: isSpotifyDropMutating } =
    useSpotifyGatedClaim(edition?.creator_airdrop_edition);
  const { claimAppleMusicGatedDrop, isMutating: isAppleMusicDropMutating } =
    useAppleMusicGatedClaim(edition?.creator_airdrop_edition);
  const redirectToClaimDrop = useRedirectToClaimDrop();
  const isLoading = isAppleMusicDropMutating || isSpotifyDropMutating;
  const { state: claimStates, dispatch } = useContext(ClaimContext);
  const { data: user, follow } = useMyInfo();

  const handleClaimNFT = async () => {
    let success: boolean | undefined | void = false;
    let type: ClaimType = "free";
    if (isLoading) {
      toast("Please wait a moment to claim your drop.");
      return;
    }
    if (
      claimStates.status === "loading" &&
      claimStates.signaturePrompt === false
    ) {
      toast("Please wait for the previous collect to complete.");
      return;
    }
    dispatch({ type: "initial" });
    if (
      user?.data?.profile.profile_id !==
      edition?.creator_airdrop_edition.owner_profile_id
    ) {
      follow(edition?.creator_airdrop_edition.owner_profile_id);
    }

    if (
      claimStates.status === "loading" &&
      claimStates.signaturePrompt === false
    ) {
      toast("Please wait for the previous collect to complete.");
      return;
    }
    if (
      edition?.gating_type === "multi_provider_music_save" ||
      edition?.gating_type === "multi_provider_music_presave"
    ) {
      if (edition?.spotify_track_url) {
        Analytics.track(EVENTS.SPOTIFY_SAVE_PRESSED_BEFORE_LOGIN);
        success = await claimSpotifyGatedDrop({});
      } else {
        Analytics.track(EVENTS.APPLE_MUSIC_SAVE_PRESSED_BEFORE_LOGIN);
        success = await claimAppleMusicGatedDrop({});
      }
    } else if (
      edition?.gating_type === "spotify_save" ||
      edition?.gating_type === "spotify_presave" ||
      edition?.gating_type === "music_presave"
    ) {
      Analytics.track(EVENTS.SPOTIFY_SAVE_PRESSED_BEFORE_LOGIN);
      success = await claimSpotifyGatedDrop({});
    } else if (
      edition?.gating_type === "password" ||
      edition?.gating_type === "location" ||
      edition?.gating_type === "multi"
    ) {
      redirectToClaimDrop(
        edition?.creator_airdrop_edition.contract_address,
        type
      );
    } else {
      success = await claimNFT({});
    }
  };

  return { handleClaimNFT };
};
