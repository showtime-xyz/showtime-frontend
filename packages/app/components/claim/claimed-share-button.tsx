import { Platform, StyleProp, ViewStyle } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { ButtonProps } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { NFT } from "app/types";

type ClaimedShareButtonProps = Pick<ButtonProps, "theme"> & {
  nft?: NFT;
  edition: CreatorEditionResponse;
  tw?: string;
  style?: StyleProp<ViewStyle>;
  size?: ButtonProps["size"];
};

export const ClaimedShareButton = ({
  edition,
  size = "small",
  tw = "",
  style,
  nft,
  ...rest
}: ClaimedShareButtonProps) => {
  const router = useRouter();
  const onPress = () => {
    const contractAddress = edition.creator_airdrop_edition.contract_address;
    const as = `/nft/${nft?.chain_name}/${nft?.contract_address}/${nft?.token_id}/share`;
    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            contractAddress,
            tokenId: nft?.token_id,
            chainName: nft?.chain_name,
            dropViewShareModal: true,
          },
        } as any,
      }),
      Platform.select({
        native: as,
        web: router.asPath,
      }),
      { shallow: true }
    );
  };

  if (!edition || !edition.is_already_claimed) return null;
  return (
    <Button onPress={onPress} size={size} style={style} tw={tw} {...rest}>
      Share
    </Button>
  );
};
