import { withModalScreen } from "@showtime-xyz/universal.modal-screen";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { DropViewShare } from "app/components/drop/drop-view-share";
import { Media } from "app/components/media";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { createParam } from "app/navigation/use-param";

type Query = {
  contractAddress: string;
  tokenId?: string;
  chainName?: string;
};

const { useParam } = createParam<Query>();

export const DropViewShareComponent = () => {
  const [contractAddress] = useParam("contractAddress");
  const [tokenId] = useParam("tokenId");
  const [chainName] = useParam("chainName");

  const { data: edition } = useCreatorCollectionDetail(contractAddress);
  const { data: nft } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });

  if (!edition || !nft)
    return (
      <View tw="h-80 items-center justify-center">
        <Spinner />
      </View>
    );

  return (
    <DropViewShare
      title={edition?.creator_airdrop_edition?.name}
      description={edition?.creator_airdrop_edition.description}
      file={edition?.creator_airdrop_edition?.image_url}
      contractAddress={contractAddress}
      appleMusicTrackUrl={edition?.apple_music_track_url}
      spotifyUrl={edition?.spotify_track_url}
      preivewComponent={({ size }) => (
        <Media
          item={nft.data.item}
          sizeStyle={{
            width: size,
            height: size,
          }}
          optimizedWidth={size}
          isMuted
        />
      )}
      tw="my-2"
    />
  );
};

export const DropViewShareScreen = withModalScreen(DropViewShareComponent, {
  title: "Congrats! Now share it.",
  matchingPathname: "/nft/[chainName]/[contractAddress]/[tokenId]/share",
  matchingQueryParam: "dropViewShareModal",
  snapPoints: ["100%"],
});
