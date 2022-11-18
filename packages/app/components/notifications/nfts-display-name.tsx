import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";

import { NotificationNFT } from "app/hooks/use-notifications";
import { TextLink } from "app/navigation/link";
import { findTokenChainName } from "app/utilities";

type NotificationDescriptionProps = {
  nfts: NotificationNFT[];
};

const getNFTLink = (nft: NotificationNFT) =>
  `/nft/${findTokenChainName(nft?.chain_identifier)}/${nft?.contract_address}/${
    nft?.token_identifier
  }`;

export const NFTSDisplayName = ({ nfts }: NotificationDescriptionProps) => {
  const router = useRouter();
  if (!nfts || nfts?.length === 0) return null;
  if (nfts.length === 1) {
    const nft = nfts[0];
    return (
      <Text
        onPress={() => {
          router.push(getNFTLink(nft));
        }}
        tw="text-13 font-bold text-black dark:text-white"
      >
        {nft.display_name}
      </Text>
    );
  }

  const nft = nfts[0];
  return (
    <>
      <Text
        onPress={() => {
          router.push(getNFTLink(nft));
        }}
        key={nft.id}
        tw="text-13 font-bold text-black dark:text-white"
      >
        {nft.display_name}
      </Text>
      <TextLink
        href={`/@${
          nft.creator.username || nft.creator.wallet_address
        }?tabType=owned`}
        tw="text-13 font-bold text-gray-600 dark:text-gray-400"
      >{` and ${nfts.length - 1} more`}</TextLink>
    </>
  );
};
