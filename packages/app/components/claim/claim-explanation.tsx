import { View } from "@showtime-xyz/universal.view";

import { Media } from "app/components/media";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { IEdition } from "app/types";
import { getCreatorUsernameFromNFT } from "app/utilities";

import { Explanation } from "../explanation";

const values = [
  {
    description: "Showcase the item in your wallet everywhere.",
  },
  {
    description: "This is completely free!",
  },
  {
    description: "This NFT may unlock new features over time.",
  },
];

export const ClaimExplanation = ({
  onDone,
  edition,
}: {
  onDone: () => void;
  edition?: IEdition;
}) => {
  const { data: token } = useNFTDetailByTokenId({
    chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
    contractAddress: edition?.contract_address,
    tokenId: "0",
  });

  return (
    <Explanation
      values={values}
      title={`Claim this free NFT from ${getCreatorUsernameFromNFT(
        token?.data.item
      )}`}
      coverElement={
        <View tw="items-center">
          <View tw="rounded-xl shadow-xl">
            <Media
              resizeMode="contain"
              item={token?.data.item}
              sizeStyle={{
                width: 240,
                height: 240,
              }}
              tw="overflow-hidden"
            />
          </View>
        </View>
      }
      onDone={onDone}
      ctaCopy={"Continue"}
    />
  );
};
