import { View } from "@showtime-xyz/universal.view";

import { GiftButton } from "app/components/claim/gift-button";
import { CommentButton } from "app/components/feed/comment-button";
import { Like } from "app/components/feed/like";
import { NFT } from "app/types";

function Social({ nft }: { nft?: NFT }) {
  if (!nft) return null;

  return (
    <View tw="flex-row justify-between bg-white  dark:bg-black">
      <View tw="flex-row items-center">
        <Like nft={nft} />
        <View tw="w-4" />
        <CommentButton nft={nft} />
        <View tw="w-4" />
        <GiftButton nft={nft} />
      </View>
    </View>
  );
}

export { Social };
