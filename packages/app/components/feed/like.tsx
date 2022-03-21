import { useLike } from "app/context/like-context";
import { NFT } from "app/types";

import { LikeButton } from "design-system/like-button";

function Like({ nft }: { nft?: NFT }) {
  if (!nft) return null;

  const { isLiked, likeCount, toggleLike } = useLike();

  return (
    <LikeButton isLiked={isLiked} likeCount={likeCount} onPress={toggleLike} />
  );
}

export { Like };
