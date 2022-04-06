import { useCallback } from "react";

import { useRouter } from "app/navigation/use-router";
import { NFT } from "app/types";
import { getRoundedCount } from "app/utilities";

import { Button } from "design-system/button";
import { Message } from "design-system/icon";

interface CommentButtonProps {
  nft?: NFT;
}

export function CommentButton({ nft }: CommentButtonProps) {
  const router = useRouter();

  const handleOnPress = useCallback(() => {
    router.push(`/nft/${nft?.nft_id}/comments`);
  }, [router, nft?.nft_id]);

  if (!nft) {
    return null;
  }

  return (
    <Button
      variant="text"
      size="regular"
      tw="p-0 h-auto"
      onPress={handleOnPress}
    >
      <Message height={24} width={24} />{" "}
      {nft?.comment_count > 0 ? getRoundedCount(nft.comment_count) : ""}
    </Button>
  );
}
