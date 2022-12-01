import { Linking } from "react-native";

import { useShare } from "app/hooks/use-share";
import { useRudder } from "app/lib/rudderstack";
import { NFT } from "app/types";
import { findTokenChainName } from "app/utilities";
import { getTwitterIntent } from "app/utilities";

export const getNFTSlug = (nft: NFT) =>
  `/nft/${findTokenChainName(nft?.chain_identifier)}/${nft?.contract_address}/${
    nft?.token_id
  }`;

export const getNFTURL = (nft: NFT | undefined) => {
  if (!nft) {
    return "";
  }
  return `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN + getNFTSlug(nft)}`;
};

export const useShareNFT = () => {
  const { rudder } = useRudder();
  const share = useShare();

  const shareNFT = async (nft?: NFT) => {
    if (!nft) return;
    const url = getNFTURL(nft);
    const result = await share({
      url,
    });

    if (result.action === "sharedAction") {
      rudder?.track(
        "Drop Shared",
        result.activityType ? { type: result.activityType } : undefined
      );
    }
  };
  const shareNFTOnTwitter = async (nft?: NFT) => {
    if (!nft) return;
    const url = `https://${
      process.env.NEXT_PUBLIC_WEBSITE_DOMAIN
    }/t/${findTokenChainName(nft?.chain_identifier)}/${nft?.contract_address}/${
      nft?.token_id
    }`;
    // Todo: add share Claim/Drop copytext
    Linking.openURL(
      getTwitterIntent({
        url,
        message: ``,
      })
    );
    rudder?.track("Drop Shared", { type: "Twitter" });
  };

  return { shareNFT, shareNFTOnTwitter };
};
