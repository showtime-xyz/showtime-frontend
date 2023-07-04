import { Sendv2 } from "@showtime-xyz/universal.icon";

import { SocialButton, SocialButtonProps } from "app/components/social-button";
import { useShareNFT } from "app/hooks/use-share-nft";
import { useSocialColor } from "app/hooks/use-social-color";
import { NFT } from "app/types";

type CommentButtonProps = SocialButtonProps & {
  nft?: NFT;
  vertical?: boolean;
};

export function CradShareButton({ nft, ...rest }: CommentButtonProps) {
  const { iconColor } = useSocialColor();
  const { shareNFT } = useShareNFT();

  if (!nft) {
    return null;
  }

  return (
    <SocialButton onPress={() => shareNFT(nft)} {...rest}>
      <Sendv2 height={20} width={20} color={iconColor} />
    </SocialButton>
  );
}
