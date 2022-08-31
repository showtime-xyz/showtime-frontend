import { Linking } from "react-native";

import { useShare } from "app/hooks/use-share";
import { useRudder } from "app/lib/rudderstack";
import { findTokenChainName } from "app/lib/utilities";
import { NFT } from "app/types";
import { getTwitterIntent } from "app/utilities";

export const useShareNFT = () => {
  const { rudder } = useRudder();
  const share = useShare();

  const shareNFT = async (nft?: NFT) => {
    if (!nft) return;
    const result = await share({
      url: `https://showtime.xyz/t/${findTokenChainName(
        nft?.chain_identifier
      )}/${nft?.contract_address}/${nft?.token_id}`,
    });

    if (result.action === "sharedAction") {
      rudder.track(
        "NFT Shared",
        result.activityType ? { type: result.activityType } : undefined
      );
    }
  };
  const shareNFTOnTwitter = async (nft?: NFT) => {
    if (!nft) return;
    const url = `https://showtime.xyz/t/${findTokenChainName(
      nft?.chain_identifier
    )}/${nft?.contract_address}/${nft?.token_id}`;
    // Todo: add share Claim/Drop copytext
    Linking.openURL(
      getTwitterIntent({
        url,
        message: ``,
      })
    );
    rudder.track("NFT Shared", { type: "Twitter" });
  };

  return { shareNFT, shareNFTOnTwitter };
};
