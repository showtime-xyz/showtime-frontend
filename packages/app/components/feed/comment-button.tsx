import { useCallback } from "react";
import { Platform } from "react-native";

import { Message } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";

import { SocialButton } from "app/components/social-button";
import { useComments } from "app/hooks/api/use-comments";
import { useSocialColor } from "app/hooks/use-social-color";
import { NFT } from "app/types";
import { formatNumber } from "app/utilities";

interface CommentButtonProps {
  nft?: NFT;
}

export function CommentButton({ nft }: CommentButtonProps) {
  const router = useRouter();
  const { iconColor } = useSocialColor();
  const { commentsCount } = useComments(nft?.nft_id ?? -Infinity);

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
    <SocialButton
      onPress={handleOnPress}
      text={commentsCount > 0 ? ` ${formatNumber(commentsCount)}` : ""}
    >
      <Message height={24} width={24} color={iconColor} />
    </SocialButton>
  );
}
