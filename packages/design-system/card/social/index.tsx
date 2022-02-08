import { View } from "design-system/view";
import { Button } from "design-system/card/social/button";
import { useMyInfo } from "app/hooks/api-hooks";
import { useCallback, useMemo, useState } from "react";
import { NFT } from "app/types";

function Social({ nft }: { nft?: NFT }) {
  if (!nft) return null;

  const { isLiked, like, unlike } = useMyInfo();

  const isLikedNft = useMemo(() => isLiked(nft.nft_id), [isLiked, nft.nft_id]);

  const [likeCount, setLikeCount] = useState(nft.like_count);

  return (
    <View tw="px-4 py-2 bg-white dark:bg-black flex-row justify-between">
      <View tw="flex-row">
        <Button
          variant="like"
          count={likeCount}
          active={isLikedNft}
          onPress={useCallback(async () => {
            if (isLikedNft) {
              const isSuccessfullyUnlike = await unlike(nft.nft_id);
              if (isSuccessfullyUnlike) {
                setLikeCount(likeCount - 1);
              }
            } else {
              const isSuccessfullyLiked = await like(nft.nft_id);
              if (isSuccessfullyLiked) {
                setLikeCount(likeCount + 1);
              }
            }
          }, [isLikedNft, like, unlike, likeCount])}
        />
        {/* <View tw="ml-2" />
        <Button variant="comment" count={nft.comment_count} /> */}
      </View>

      {/* <View>
        <Button variant="boost" count={0} />
      </View> */}
    </View>
  );
}

export { Social };
