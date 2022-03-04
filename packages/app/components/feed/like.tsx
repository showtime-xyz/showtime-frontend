import { useCallback, useMemo, useState } from "react";

import * as Haptics from "expo-haptics";

import { useMyInfo } from "app/hooks/api-hooks";
import { NFT } from "app/types";

import { LikeButton } from "design-system";

function Like({ nft }: { nft?: NFT }) {
  if (!nft) return null;

  const { isLiked, like, unlike } = useMyInfo();

  const isLikedNft = useMemo(() => isLiked(nft.nft_id), [isLiked, nft.nft_id]);

  const [likeCount, setLikeCount] = useState(
    typeof nft.like_count === "number" ? nft.like_count : 0
  );

  return (
    <LikeButton
      isLiked={isLikedNft}
      likeCount={likeCount}
      onPress={useCallback(async () => {
        if (isLikedNft) {
          setLikeCount(likeCount - 1);
          const isSuccessfullyUnlike = await unlike(nft.nft_id);
          if (!isSuccessfullyUnlike) {
            setLikeCount(likeCount + 1);
          }
        } else {
          Haptics.selectionAsync();
          setLikeCount(likeCount + 1);
          const isSuccessfullyLiked = await like(nft.nft_id);
          if (!isSuccessfullyLiked) {
            setLikeCount(likeCount - 1);
          }
        }
      }, [isLikedNft, like, unlike, likeCount])}
    />
  );
}

export { Like };
