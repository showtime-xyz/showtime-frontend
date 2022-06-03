import { LikeButton } from "app/components/like-button";
import { useLike } from "app/context/like-context";
import { NFT } from "app/types";

function Like({ nft }: { nft?: NFT }) {
  const { isLiked, likeCount, toggleLike } = useLike();

  if (!nft) return null;

  return (
    <LikeButton isLiked={isLiked} likeCount={likeCount} onPress={toggleLike} />
  );
}

export { Like };
