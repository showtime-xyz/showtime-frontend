import { useCallback } from "react";
import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Message } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";

import { useSocialColor } from "app/hooks/use-social-color";
import { NFT } from "app/types";
import { getRoundedCount } from "app/utilities";

interface CommentButtonProps {
  nft?: NFT;
}

export function CommentButton({ nft }: CommentButtonProps) {
  const router = useRouter();
  const { iconColor, textColors } = useSocialColor();

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
        } as any,
      }),
      Platform.select({
        native: as,
        web: router.asPath,
      }),
      { shallow: true }
    );
  }, [router, nft]);

  if (!nft) {
    return null;
  }

  return (
    <Button
      variant="text"
      size="regular"
      tw="h-auto p-0"
      onPress={handleOnPress}
      accentColor={textColors}
    >
      <Message height={24} width={24} color={iconColor} />{" "}
      {nft?.comment_count > 0 ? getRoundedCount(nft.comment_count) : ""}
    </Button>
  );
}
