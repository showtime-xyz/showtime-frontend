import { View } from "@showtime-xyz/universal.view";

import { GiftButton } from "app/components/claim/gift-button";
import { CommentButton } from "app/components/feed/comment-button";
import { Like } from "app/components/feed/like";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { NFT } from "app/types";

function Social({ nft }: { nft?: NFT }) {
  const { data: edition } = useCreatorCollectionDetail(
    nft?.creator_airdrop_edition_address
  );

  if (!nft) return null;

  return (
    <View tw="flex-row justify-between bg-white px-4 py-2 dark:bg-black">
      <View tw="flex-row">
        <Like nft={nft} />
        <View tw="ml-2" />
        <CommentButton nft={nft} />
        {edition ? (
          <>
            <View tw="ml-2" />
            <GiftButton nft={nft} />
          </>
        ) : null}
      </View>
    </View>
  );
}

export { Social };
