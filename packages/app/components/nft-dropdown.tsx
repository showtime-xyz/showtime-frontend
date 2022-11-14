import { useMemo, ComponentType, useState } from "react";
import { Dimensions, Linking, Modal, Platform, StyleSheet } from "react-native";

import { SvgProps } from "react-native-svg";
import * as DropdownMenu from "zeego/dropdown-menu";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuItemNativeIcon,
} from "@showtime-xyz/universal.dropdown-menu";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  MoreHorizontal,
  UserMinus,
  Flag,
  EyeOff,
  Copy,
  Slash,
  Refresh,
  Twitter,
  Showtime,
  QrCode,
} from "@showtime-xyz/universal.icon";
import { Close } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors, TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { QRCode } from "app/components/qr-code";
import { useProfileTabType } from "app/context/profile-tabs-nft-context";
import { useMyInfo } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useHideNFT } from "app/hooks/use-hide-nft";
import { useRefreshMedadata } from "app/hooks/use-refresh-metadata";
import { useReport } from "app/hooks/use-report";
import { getNFTURL, useShareNFT } from "app/hooks/use-share-nft";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { useSocialColor } from "app/hooks/use-social-color";
import { useUser } from "app/hooks/use-user";
import { scheme } from "app/lib/scheme";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";
import type { NFT } from "app/types";
import { isMobileWeb, isAndroid } from "app/utilities";

import { OpenSea } from "design-system/icon";

const { width: windowWidth } = Dimensions.get("window");

const MenuItemIcon = ({ Icon, ...rest }: { Icon: ComponentType<SvgProps> }) => {
  return <Icon width="1em" height="1em" color={colors.gray[500]} {...rest} />;
};

type Props = {
  nft: NFT;
  shouldEnableSharing?: boolean;
  tw?: TW;
  iconColor?: string;
};

function NFTDropdown({
  nft,
  shouldEnableSharing = true,
  tw = "",
  iconColor: iconColorProp,
}: Props) {
  //#region hooks
  const { iconColor } = useSocialColor();

  const isDark = useIsDarkMode();
  const tabType = useProfileTabType();
  const { isAuthenticated } = useUser();
  const { report } = useReport();
  const { unfollow, isFollowing } = useMyInfo();
  const { hideNFT, unhideNFT } = useHideNFT();
  const { getIsBlocked, toggleBlock } = useBlock();
  const router = useRouter();

  const isCreatorDrop = nft.creator_airdrop_edition_address;
  const { shareNFT, shareNFTOnTwitter } = useShareNFT();
  const refreshMetadata = useRefreshMedadata();
  const navigateToLogin = useNavigateToLogin();
  //#endregion

  //#region variables
  const hasOwnership = nft.is_user_owner;

  const isFollowingUser = useMemo(
    () => nft.owner_id && isFollowing(nft.creator_id),
    [nft.creator_id, nft.owner_id, isFollowing]
  );
  const isBlocked = useMemo(
    () => getIsBlocked(nft.creator_id),
    [nft.creator_id, getIsBlocked]
  );
  //#endregion

  const isShareAPIAvailable = Platform.select({
    default: true,
    web: typeof window !== "undefined" && !!navigator.share,
  });

  const viewOnOpenSea = () => {
    // Todo: maybe need to use token_id from backend.
    const token_id = "1";
    const link = `https://opensea.io/assets/matic/${nft.contract_address}/${token_id}`;
    Linking.openURL(link);
  };

  const [showQRCodeModal, setShowQRCodeModal] = useState(false);

  return (
    <>
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <Pressable tw={tw} accessibilityLabel="nft card item menu">
            <MoreHorizontal
              width={24}
              height={24}
              color={iconColorProp ?? iconColor}
            />
          </Pressable>
        </DropdownMenuTrigger>

        <DropdownMenuContent loop>
          {tabType && tabType !== "hidden" ? (
            <DropdownMenuItem
              onSelect={() => {
                hideNFT(nft.nft_id);
              }}
              key="hide"
            >
              <MenuItemIcon Icon={EyeOff} />
              <DropdownMenuItemNativeIcon iosIconName="eye.slash" />

              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                Hide
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          ) : null}

          {tabType && tabType === "hidden" ? (
            <DropdownMenuItem
              onSelect={() => {
                unhideNFT(nft.nft_id);
              }}
              key="unhide"
            >
              <MenuItemIcon Icon={EyeOff} />
              <DropdownMenuItemNativeIcon iosIconName="eye" />
              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                Unhide
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          ) : null}

          {isMobileWeb() ? (
            <DropdownMenuItem
              onSelect={() => {
                window.location.replace(`${scheme}://${getNFTSlug(nft)}`);

                setTimeout(function () {
                  window.open(
                    isAndroid()
                      ? "https://play.google.com/store/apps/details?id=io.showtime"
                      : "https://apps.apple.com/us/app/showtime-nft-social-network/id1606611688",
                    "_blank"
                  );
                }, 2000);
              }}
              key="open-in-app"
            >
              <MenuItemIcon Icon={Showtime} />
              <DropdownMenuItemNativeIcon
                iosIconName={isBlocked ? "circle" : "circle.slash"}
              />

              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                Open in app
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          ) : null}

          {nft.multiple_owners_list &&
            nft.multiple_owners_list.length > 0 &&
            nft.contract_address && (
              <DropdownMenuItem onSelect={viewOnOpenSea} key="opensea">
                <MenuItemIcon Icon={OpenSea} />
                <DropdownMenuItemNativeIcon iosIconName="arrow.right" />

                <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                  View on OpenSea
                </DropdownMenuItemTitle>
              </DropdownMenuItem>
            )}

          {shouldEnableSharing && (
            <>
              {!isShareAPIAvailable && (
                <DropdownMenuItem
                  onSelect={() => shareNFTOnTwitter(nft)}
                  key="share-twitter"
                >
                  <MenuItemIcon Icon={Twitter} />

                  <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                    Share on Twitter
                  </DropdownMenuItemTitle>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onSelect={() => shareNFT(nft)} key="copy-link">
                <MenuItemIcon Icon={Copy} />
                <DropdownMenuItemNativeIcon iosIconName="square.and.arrow.up" />

                <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                  {isShareAPIAvailable ? "Share" : "Copy Link"}
                </DropdownMenuItemTitle>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenu.Item
            onSelect={() => {
              setShowQRCodeModal(true);
            }}
            key="qr-code"
          >
            <MenuItemIcon Icon={QrCode} />
            <DropdownMenuItemNativeIcon iosIconName="qrcode" />

            <DropdownMenu.ItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
              QR Code
            </DropdownMenu.ItemTitle>
          </DropdownMenu.Item>

          {!isCreatorDrop && (
            <DropdownMenuItem
              onSelect={() => refreshMetadata(nft)}
              key="refresh-metadata"
            >
              <MenuItemIcon Icon={Refresh} />
              <DropdownMenuItemNativeIcon iosIconName="arrow.triangle.2.circlepath" />

              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                Refresh Metadata
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          )}

          {!hasOwnership && isFollowingUser && (
            <DropdownMenuItem
              onSelect={async () => {
                if (isAuthenticated) {
                  await unfollow(nft.creator_id);
                  // refresh();
                } else {
                  navigateToLogin();
                }
              }}
              key="unfollow"
            >
              <MenuItemIcon Icon={UserMinus} />
              <DropdownMenuItemNativeIcon iosIconName="person.fill.badge.plus" />

              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                Unfollow User
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          )}

          {!hasOwnership ? (
            <DropdownMenuItem
              className="danger"
              key="block"
              onSelect={() =>
                toggleBlock({
                  isBlocked,
                  creatorId: nft.creator_id,
                  name: nft.creator_name,
                })
              }
            >
              <MenuItemIcon Icon={Slash} />
              <DropdownMenuItemNativeIcon
                iosIconName={isBlocked ? "circle" : "circle.slash"}
              />

              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                {isBlocked ? "Unblock User" : "Block User"}
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          ) : null}

          {!hasOwnership && (
            <DropdownMenuItem
              onSelect={async () => {
                await report({ nftId: nft.nft_id });
                router.pop();
              }}
              key="report"
            >
              <MenuItemIcon Icon={Flag} />

              <DropdownMenuItemNativeIcon iosIconName="flag" />
              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                Report
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenuRoot>
      <Modal
        visible={showQRCodeModal}
        transparent
        onRequestClose={() => setShowQRCodeModal(false)}
        animationType="fade"
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          tw="bg-gray-900 opacity-40"
          onPress={() => setShowQRCodeModal(false)}
        />
        <View tw="my-auto items-center justify-center self-center">
          <View tw="rounded-lg bg-white p-4 pb-8 dark:bg-gray-900">
            <Pressable tw="mb-4" onPress={() => setShowQRCodeModal(false)}>
              <Close
                color={isDark ? "white" : "black"}
                height={32}
                width={32}
              />
            </Pressable>
            <QRCode
              text={getNFTURL(nft)}
              size={windowWidth >= 768 ? 400 : windowWidth >= 400 ? 250 : 300}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

export { NFTDropdown };
