import { useCallback } from "react";
import { Linking } from "react-native";

import * as Clipboard from "expo-clipboard";

import { useShare } from "app/hooks/use-share";
import { Analytics, EVENTS } from "app/lib/analytics";
import { NFT } from "app/types";
import { findTokenChainName } from "app/utilities";
import { getTwitterIntent, getTwitterIntentUsername } from "app/utilities";

import { toast } from "design-system/toast";

import { useUserProfile } from "./api-hooks";

export const getNFTSlug = (nft: NFT) => {
  if (nft.slug) {
    return `/@${nft.creator_username ?? nft.creator_address}/${nft.slug}`;
  } else {
    return `/nft/${findTokenChainName(nft?.chain_identifier)}/${
      nft?.contract_address
    }/${nft?.token_id}`;
  }
};

export const getNFTURL = (nft: NFT | undefined) => {
  if (!nft) {
    return "";
  }
  return `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN + getNFTSlug(nft)}`;
};

export const useShareNFT = () => {
  const { share } = useShare();

  const shareNFT = async (nft?: NFT) => {
    if (!nft) return;
    const url = getNFTURL(nft);
    const result = await share({
      url,
    });

    if (result.action === "sharedAction") {
      Analytics.track(
        EVENTS.DROP_SHARED,
        result.activityType ? { type: result.activityType } : undefined
      );
    }
  };
  const copyNFTLink = async (nft?: NFT) => {
    if (!nft) return;
    const url = getNFTURL(nft);
    await Clipboard.setStringAsync(url);
    toast.success("Copied!");
  };
  const shareNFTOnTwitter = async (nft?: NFT) => {
    if (!nft) return;
    const url = getNFTURL(nft);
    // Todo: add share Claim/Drop copytext
    Linking.openURL(
      getTwitterIntent({
        url,
        message: `Just collected "${nft?.token_name}" on @Showtime_xyz ✦\n\n${
          nft?.gating_type === "paid_nft"
            ? "Collect to unlock:"
            : "Collect it for free here:"
        }`,
      })
    );
    Analytics.track(EVENTS.DROP_SHARED, { type: "Twitter" });
  };

  return { shareNFT, shareNFTOnTwitter, copyNFTLink };
};

export const useShareNFTOnTwitter = (nft: NFT) => {
  const { data: creatorProfile } = useUserProfile({
    address: nft?.creator_address,
  });

  const shareNFTOnTwitter = useCallback(async () => {
    if (!nft) return;
    const url = getNFTURL(nft);
    // Todo: add share Claim/Drop copytext
    Linking.openURL(
      getTwitterIntent({
        url,
        message: `Just collected "${
          nft?.token_name
        }" ${`by ${getTwitterIntentUsername(
          creatorProfile?.data?.profile
        )}`} on @Showtime_xyz ✦\n\n${
          nft?.gating_type === "paid_nft"
            ? "Collect to unlock:"
            : "Collect it for free here:"
        }`,
      })
    );
    Analytics.track(EVENTS.DROP_SHARED, { type: "Twitter" });
  }, [creatorProfile?.data?.profile, nft]);

  return { shareNFTOnTwitter };
};
