import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  MoreHorizontal,
  Copy,
  Twitter,
  QrCode,
  Sendv2,
} from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { TW, colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { useShareNFT } from "app/hooks/use-share-nft";
import { useSocialColor } from "app/hooks/use-social-color";
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
};

export function NFTShareDropdown({ nft, children, tw = "" }: Props) {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const { shareNFT, shareNFTOnTwitter } = useShareNFT();
  const isShareAPIAvailable = Platform.select({
    default: true,
    web: typeof window !== "undefined" && !!navigator.share,
  });

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        {children ? (
          children
        ) : (
          <FeedSocialButton text="Share" tw={tw}>
            <View tw="h-0.5" />
            <Sendv2 color={isDark ? colors.white : colors.gray[900]} />
          </FeedSocialButton>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent loop sideOffset={8}>
        {!isShareAPIAvailable && (
          <DropdownMenuItem
            onSelect={() => shareNFTOnTwitter(nft)}
            key="share-twitter"
          >
            <MenuItemIcon Icon={Twitter} />

            <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
              Share on Twitter
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={() => shareNFT(nft)} key="copy-link">
          <MenuItemIcon
            Icon={Copy}
            ios={{
              name: "square.and.arrow.up",
            }}
          />
          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            {isShareAPIAvailable ? "Share" : "Copy Link"}
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            const as = `/qr-code-share/${nft?.contract_address}`;
            router.push(
              Platform.select({
                native: as,
                web: {
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    contractAddress: nft?.contract_address,
                    qrCodeShareModal: true,
                  },
                } as any,
              }),
              Platform.select({
                native: as,
                web: router.asPath,
              }),
              { shallow: true }
            );
          }}
          key="qr-code"
        >
          <MenuItemIcon
            Icon={QrCode}
            ios={{
              name: "qrcode",
            }}
          />
          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            QR Code
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}
