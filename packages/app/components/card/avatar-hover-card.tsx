import type { NFT } from "app/types";

import { Avatar } from "design-system/avatar";

type Props = {
  nft?: NFT;
  shouldShowCreatorIndicator?: boolean;
  shouldShowDateCreated?: boolean;
  label?: string;
};

export function AvatarHoverCard({ nft }: Props) {
  if (!nft) return null;

  return <Avatar alt="Avatar" url={nft.creator_img_url} />;
}
