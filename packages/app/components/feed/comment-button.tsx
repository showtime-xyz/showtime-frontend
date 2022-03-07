import { useCallback } from "react";

import { useRouter } from "app/navigation/use-router";
import { NFT } from "app/types";
import { getRoundedCount } from "app/utilities";

import { TextButton } from "design-system/button";
import { Message } from "design-system/icon";

interface CommentButtonProps {
  nft?: NFT;
}

export function CommentButton({ nft }: CommentButtonProps) {
  const router = useRouter();

  const handleOnPress = useCallback(() => {
    router.push(`/comments?nftId=${nft?.nft_id}`);
  }, [router, nft?.nft_id]);

  if (!nft) {
    return null;
  }

  return (
    <TextButton size="regular" tw="my--3" onPress={handleOnPress}>
      <Message /> {getRoundedCount(nft.comment_count)}
    </TextButton>
  );
}
