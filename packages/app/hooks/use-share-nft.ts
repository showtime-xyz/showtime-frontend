import { useShare } from "app/hooks/use-share";
import { track } from "app/lib/analytics";
import { CHAIN_IDENTIFIERS } from "app/lib/constants";
import { NFT } from "app/types";

export const useShareNFT = () => {
  const share = useShare();

  const shareNFT = async (nft?: NFT) => {
    if (nft) {
      const tokenChainName = Object.keys(CHAIN_IDENTIFIERS).find(
        //@ts-ignore
        (key) => CHAIN_IDENTIFIERS[key] == nft?.chain_identifier
      );
      const result = await share({
        url: `https://showtime.io/t/${tokenChainName}/${nft?.contract_address}/${nft?.token_id}`,
      });

      if (result.action === "sharedAction") {
        track(
          "NFT Shared",
          result.activityType ? { type: result.activityType } : undefined
        );
      }
    }
  };

  return shareNFT;
};
