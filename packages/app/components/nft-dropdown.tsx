import { useMemo, useCallback } from "react";
import { Linking, Platform } from "react-native";

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
  Edit,
  QrCode,
  Sendv2,
  Download3,
} from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { TW } from "@showtime-xyz/universal.tailwind";

import { useProfileTabType } from "app/context/profile-tabs-nft-context";
import { useMyInfo } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { downloadCollectorList } from "app/hooks/use-download-collector-list";
import { useHideNFT } from "app/hooks/use-hide-nft";
import { useRedirectDropImageShareScreen } from "app/hooks/use-redirect-to-drop-image-share-screen";
import { useRefreshMedadata } from "app/hooks/use-refresh-metadata";
import { useShareNFT, useShareNFTOnTwitter } from "app/hooks/use-share-nft";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { useSocialColor } from "app/hooks/use-social-color";
import { useUser } from "app/hooks/use-user";
import { scheme } from "app/lib/scheme";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";
import type { NFT } from "app/types";
import { isMobileWeb, isAndroid } from "app/utilities";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";
import { OpenSea } from "design-system/icon";

import { MenuItemIcon } from "./dropdown/menu-item-icon";

type Props = {
  nft: NFT;
  shouldEnableSharing?: boolean;
  tw?: TW;
  iconColor?: string;
  iconSize?: number;
  edition?: CreatorEditionResponse;
  children?: JSX.Element;
};

function NFTDropdown({
  nft,
  shouldEnableSharing = true,
  tw = "",
  iconColor: iconColorProp,
  iconSize = 24,
  edition,
  children,
}: Props) {
  //#region hooks
  const { iconColor } = useSocialColor();

  const tabType = useProfileTabType();
  const { isAuthenticated, user } = useUser();
  const { unfollow, isFollowing } = useMyInfo();
  const { hideNFT, unhideNFT } = useHideNFT();
  const { getIsBlocked, toggleBlock } = useBlock();
  const { shareNFTOnTwitter } = useShareNFTOnTwitter(nft);

  const router = useRouter();

  const isCreatorDrop = nft.creator_airdrop_edition_address;
  const { shareNFT } = useShareNFT();
  const refreshMetadata = useRefreshMedadata();
  const navigateToLogin = useNavigateToLogin();
  const redirectToStarDropShareScreen = useRedirectDropImageShareScreen();

  //#endregion

  //#region variables
  const hasOwnership = nft.is_user_owner;
  const isSelf = user?.data?.profile?.profile_id === nft?.creator_id;

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

  const viewOnOpenSea = useCallback(() => {
    const chainName = nft?.chain_name === "polygon" ? "matic" : nft?.chain_name;
    const link = `https://opensea.io/assets/${chainName}/${nft.contract_address}`;
    Linking.openURL(link);
  }, [nft?.chain_name, nft.contract_address]);

  const dropdownMaps = useMemo(() => {
    return [
      {
        title: "Share...",
        show: true,
        icon: Sendv2,
        iosIconName: "paperplane",
        onSelect: () => redirectToStarDropShareScreen(nft?.contract_address),
      },
      {
        title: "Share on Twitter",
        show: !isShareAPIAvailable && shouldEnableSharing,
        icon: Twitter,
        iosIconName: "link",
        onSelect: () => shareNFTOnTwitter(),
      },
      {
        title: isShareAPIAvailable ? "Share" : "Copy Link",
        show: shouldEnableSharing,
        icon: Copy,
        iosIconName: "square.and.arrow.up",
        onSelect: () => shareNFT(nft),
      },
      {
        title: "Download collector list",
        show:
          nft.multiple_owners_list &&
          nft.multiple_owners_list.length > 0 &&
          nft.contract_address &&
          edition?.is_onchain,
        icon: Download3,
        iosIconName: "arrow.down.doc",
        onSelect: () => downloadCollectorList(nft?.contract_address),
      },
      {
        title: "View on OpenSea",
        show:
          nft.multiple_owners_list &&
          nft.multiple_owners_list.length > 0 &&
          nft.contract_address &&
          edition?.is_onchain,
        icon: OpenSea,
        iosIconName: "arrow.right",
        onSelect: viewOnOpenSea,
      },
      {
        title: "Show QR Code",
        show: true,
        icon: QrCode,
        iosIconName: "qrcode",
        onSelect: () => {
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
        },
      },
      {
        title: "Edit Drop Details",
        show: edition?.is_editable && isSelf,
        icon: Edit,
        iosIconName: "square.and.pencil",
        onSelect: () => {
          const contractAddress = nft?.contract_address;
          const tokenId = nft?.token_id;
          const chainName = nft?.chain_name;

          const as = `/drop/edit-details/${chainName}/${contractAddress}/${tokenId}`;
          router.push(
            Platform.select({
              native: as,
              web: {
                pathname: router.pathname,
                query: {
                  ...router.query,
                  contractAddress,
                  tokenId,
                  chainName,
                  dropEditDetailsModal: true,
                },
              } as any,
            }),
            Platform.select({
              native: as,
              web: router.asPath,
            }),
            { shallow: true }
          );
        },
      },
      {
        title: "Open in app",
        show: isMobileWeb(),
        icon: Showtime,
        iosIconName: "arrow.right",
        onSelect: () => {
          window.location.replace(`${scheme}://${getNFTSlug(nft)}`);

          setTimeout(function () {
            window.open(
              isAndroid()
                ? "https://play.google.com/store/apps/details?id=io.showtime"
                : "https://apps.apple.com/us/app/showtime-nft-social-network/id1606611688",
              "_blank"
            );
          }, 2000);
        },
      },
      {
        title: "Refresh Metadata",
        show: !isCreatorDrop,
        icon: Refresh,
        iosIconName: "arrow.triangle.2.circlepath",
        onSelect: () => refreshMetadata(nft),
      },
      {
        title: "Unfollow User",
        show: !hasOwnership && isFollowingUser && !isSelf,
        icon: UserMinus,
        iosIconName: "person.fill.badge.plus",
        onSelect: async () => {
          if (isAuthenticated) {
            await unfollow(nft.creator_id);
            return null;
          } else {
            navigateToLogin();
          }
        },
      },
      {
        title: isBlocked ? "Unblock User" : "Block User",
        show: !hasOwnership && !isSelf,
        icon: Slash,
        iosIconName: isBlocked ? "circle" : ("circle.slash" as any),
        onSelect: () =>
          toggleBlock({
            isBlocked,
            creatorId: nft.creator_id,
            name: nft.creator_name,
          }),
      },
      {
        title: "Hide",
        show: tabType && tabType !== "hidden",
        icon: EyeOff,
        iosIconName: "eye.slash",
        onSelect: () => hideNFT(nft.nft_id),
      },
      {
        title: "Unhide",
        show: tabType && tabType === "hidden" && isSelf,
        icon: EyeOff,
        iosIconName: "eye",
        onSelect: () => {
          unhideNFT(nft.nft_id);
        },
      },
      {
        title: "Report",
        show: !hasOwnership && !isSelf,
        icon: Flag,
        iosIconName: "flag",
        onSelect: async () => {
          router.push(
            {
              pathname: Platform.OS === "web" ? router.pathname : "/report",
              query: {
                ...router.query,
                reportModal: true,
                nftId: nft.nft_id,
              },
            },
            Platform.OS === "web" ? router.asPath : undefined
          );
        },
      },
    ];
  }, [
    edition?.is_editable,
    edition?.is_onchain,
    hasOwnership,
    hideNFT,
    isAuthenticated,
    isBlocked,
    isCreatorDrop,
    isFollowingUser,
    isSelf,
    isShareAPIAvailable,
    navigateToLogin,
    nft,
    redirectToStarDropShareScreen,
    refreshMetadata,
    router,
    shareNFT,
    shareNFTOnTwitter,
    shouldEnableSharing,
    tabType,
    toggleBlock,
    unfollow,
    unhideNFT,
    viewOnOpenSea,
  ]);
  return (
    <>
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          {children ? (
            children
          ) : (
            <Pressable tw={tw} aria-label="nft card item menu">
              <MoreHorizontal
                width={iconSize}
                height={iconSize}
                color={iconColorProp ?? iconColor}
              />
            </Pressable>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent loop sideOffset={8}>
          {dropdownMaps.map((item) => {
            return item.show ? (
              <DropdownMenuItem
                onSelect={item.onSelect}
                key={item.title}
                className={item.title === "Block User" ? "danger" : ""}
              >
                <MenuItemIcon
                  Icon={item.icon}
                  ios={{
                    name: item.iosIconName,
                  }}
                />
                <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
                  {item.title}
                </DropdownMenuItemTitle>
              </DropdownMenuItem>
            ) : null;
          })}
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </>
  );
}

export { NFTDropdown };
