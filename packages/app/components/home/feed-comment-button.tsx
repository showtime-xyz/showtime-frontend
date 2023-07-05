import { useCallback } from "react";
import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Messagev2 } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";

import { NFT } from "app/types";
import { formatNumber } from "app/utilities";

import { FeedSocialButton } from "../feed-social-button";

interface CommentButtonProps {
  nft?: NFT;
  tw?: string;
}

export function FeedCommentButton({ nft, ...rest }: CommentButtonProps) {
  const router = useRouter();
  const isDark = useIsDarkMode();
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
    <FeedSocialButton
      onPress={handleOnPress}
      text={`${formatNumber(nft?.comment_count)}`}
      buttonTw="bg-gray-100 dark:bg-gray-900"
      {...rest}
    >
      <Messagev2 color={isDark ? colors.white : colors.gray[900]} />
    </FeedSocialButton>
  );
}
