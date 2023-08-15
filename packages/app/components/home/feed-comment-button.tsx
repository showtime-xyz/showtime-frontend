import { useCallback } from "react";
import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Messagev2 } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";

import { NFT } from "app/types";
import { formatNumber } from "app/utilities";

import { FeedSocialButton, SocialButtonProps } from "../feed-social-button";

type CommentButtonProps = Pick<SocialButtonProps, "textViewStyle"> & {
  nft?: NFT;
  tw?: string;
  dark?: boolean;
};

export function FeedCommentButton({ nft, dark, ...rest }: CommentButtonProps) {
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
      dark={dark}
      {...rest}
    >
      <Messagev2
        color={dark ? colors.white : isDark ? colors.white : colors.gray[900]}
      />
    </FeedSocialButton>
  );
}
