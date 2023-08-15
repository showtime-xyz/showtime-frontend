import { ViewProps } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Copy, Twitter, Sendv2, Corner } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { useRedirectDropImageShareScreen } from "app/hooks/use-redirect-to-drop-image-share-screen";
import { useShareNFT, useShareNFTOnTwitter } from "app/hooks/use-share-nft";
import type { NFT } from "app/types";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";

import { MenuItemIcon } from "./dropdown/menu-item-icon";
import { FeedSocialButton } from "./feed-social-button";

type Props = {
  nft: NFT;
  tw?: string;
  children?: JSX.Element;
  dark?: boolean;
  textViewStyle?: ViewProps["style"];
};

export function NFTShareDropdown({
  nft,
  children,
  dark,
  tw = "",
  ...rest
}: Props) {
  const isDark = useIsDarkMode();
  const { copyNFTLink } = useShareNFT();

  const redirectToStarDropShareScreen = useRedirectDropImageShareScreen();

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        {children ? (
          children
        ) : (
          <FeedSocialButton text="Share" dark={dark} tw={tw} {...rest}>
            <View tw="h-0.5" />
            <Sendv2
              color={
                dark ? colors.white : isDark ? colors.white : colors.gray[900]
              }
            />
          </FeedSocialButton>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent loop sideOffset={8}>
        <DropdownMenuItem onSelect={() => copyNFTLink(nft)} key="copy-link">
          <MenuItemIcon
            Icon={Copy}
            ios={{
              name: "square.and.arrow.up",
            }}
          />
          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            Copy Link
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <ShareOnTwitterDropdownMenuItem nft={nft} />
        <DropdownMenuItem
          onSelect={() => redirectToStarDropShareScreen(nft.contract_address)}
          key="share-twitter"
        >
          <MenuItemIcon
            Icon={Corner}
            ios={{
              name: "arrowshape.turn.up.forward",
            }}
          />
          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            Share…
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export const ShareOnTwitterDropdownMenuItem = ({ nft }: { nft: NFT }) => {
  const { shareNFTOnTwitter } = useShareNFTOnTwitter(nft);
  return (
    <DropdownMenuItem onSelect={shareNFTOnTwitter} key="share-twitter">
      <MenuItemIcon
        Icon={Twitter}
        ios={{
          name: "link",
        }}
      />

      <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
        Share on Twitter
      </DropdownMenuItemTitle>
    </DropdownMenuItem>
  );
};
