import { StyleProp, ViewStyle } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { ButtonProps } from "@showtime-xyz/universal.button";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useRedirectDropImageShareScreen } from "app/hooks/use-redirect-to-drop-image-share-screen";
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
  const redirectToDropImageShareScreen = useRedirectDropImageShareScreen();

  if (!edition || !edition.is_already_claimed) return null;
  return (
    <Button
      onPress={() =>
        redirectToDropImageShareScreen(
          edition?.creator_airdrop_edition?.contract_address
        )
      }
      size={size}
      style={style}
      tw={tw}
      {...rest}
    >
      Share
    </Button>
  );
};
