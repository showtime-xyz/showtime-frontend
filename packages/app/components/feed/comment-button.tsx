import { useCallback } from "react";
import { Platform } from "react-native";

import { Message } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";

import { SocialButton, SocialButtonProps } from "app/components/social-button";
import { useSocialColor } from "app/hooks/use-social-color";
import { NFT } from "app/types";
import { formatNumber } from "app/utilities";

type CommentButtonProps = SocialButtonProps & {
  nft?: NFT;
  vertical?: boolean;
};

export function CommentButton({ nft, vertical, ...rest }: CommentButtonProps) {
  const router = useRouter();
  const { iconColor } = useSocialColor();
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
      vertical={vertical}
      onPress={handleOnPress}
      text={
        nft?.comment_count > 0
          ? `${vertical ? "" : " "}${formatNumber(nft?.comment_count)}`
          : vertical
          ? "0"
          : " " // this is a non-breaking space to prevent jumps
      }
      {...rest}
    >
      <Message
        height={vertical ? 32 : 24}
        width={vertical ? 32 : 24}
        color={iconColor}
      />
    </SocialButton>
  );
}
