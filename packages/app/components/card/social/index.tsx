import { View } from "@showtime-xyz/universal.view";

import { GiftButton } from "app/components/claim/gift-button";
import { CommentButton } from "app/components/feed/comment-button";
import { Like } from "app/components/feed/like";
import { NFT } from "app/types";

function Social({ nft }: { nft?: NFT }) {
  if (!nft) return null;

  return (
    <View tw="flex-row justify-between bg-white dark:bg-black">
      <View tw="-ml-4 flex-row items-center">
        <Like nft={nft} />
        <CommentButton nft={nft} />
        <GiftButton nft={nft} />
      </View>
    </View>
  );
}

export { Social };
