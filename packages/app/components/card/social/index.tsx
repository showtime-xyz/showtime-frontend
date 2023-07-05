import { View } from "@showtime-xyz/universal.view";

import { CardShareButton } from "app/components/claim/card-share-button";
import { GiftButton } from "app/components/claim/gift-button";
import { CommentButton } from "app/components/feed/comment-button";
// import { Like } from "app/components/feed/like";
import { NFT } from "app/types";

type SocialProps = {
  nft?: NFT;
  tw?: string;
};
function Social({ nft, tw = "" }: SocialProps) {
  if (!nft) return null;

  return (
    <View tw={["flex-row justify-between", tw]}>
      <View tw="-ml-4 flex-row items-center">
        {/* <Like nft={nft} /> */}
        <CommentButton nft={nft} />
        <GiftButton nft={nft} />
        <CardShareButton nft={nft} />
      </View>
    </View>
  );
}

export { Social };
