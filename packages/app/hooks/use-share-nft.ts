import { Linking } from "react-native";

import { useShare } from "app/hooks/use-share";
import { Analytics, EVENTS } from "app/lib/analytics";
import { NFT } from "app/types";
import { findTokenChainName } from "app/utilities";
import { getTwitterIntent } from "app/utilities";

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
  const shareNFTOnTwitter = async (nft?: NFT) => {
    if (!nft) return;
    const url = getNFTURL(nft);
    // Todo: add share Claim/Drop copytext
    Linking.openURL(
      getTwitterIntent({
        url,
        message: ``,
      })
    );
    Analytics.track(EVENTS.DROP_SHARED, { type: "Twitter" });
  };

  return { shareNFT, shareNFTOnTwitter };
};
