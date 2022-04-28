import { useCallback } from "react";
import { Platform } from "react-native";

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
    const as = `/nft/${nft?.chain_name}/${nft?.contract_address}/${nft?.token_id}/comments`;

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            commentsModal: true,
            chainName: nft?.chain_name,
            contractAddress: nft?.contract_address,
            tokenId: nft?.token_id,
          },
        },
      }),
      Platform.select({
        native: as,
        web: router.asPath,
      }),
      { shallow: true }
    );
  }, [router, nft?.nft_id]);

  if (!nft) {
    return null;
  }

  return (
    <Button
      variant="text"
      size="regular"
      tw="h-auto p-0"
      onPress={handleOnPress}
    >
      <Message height={24} width={24} />{" "}
      {nft?.comment_count > 0 ? getRoundedCount(nft.comment_count) : ""}
    </Button>
  );
}
