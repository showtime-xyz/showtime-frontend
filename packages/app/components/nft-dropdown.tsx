import { useMemo, ComponentType } from "react";
import { Platform } from "react-native";

import { SvgProps } from "react-native-svg";

import { Button } from "@showtime-xyz/universal.button";
import type { ButtonProps } from "@showtime-xyz/universal.button/types";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuItemIcon,
  DropdownMenuTrigger,
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
  Clock,
  Twitter,
} from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";

import { useProfileTabType } from "app/context/profile-tabs-nft-context";
import { useMyInfo } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useHideNFT } from "app/hooks/use-hide-nft";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useRefreshMedadata } from "app/hooks/use-refresh-metadata";
import { useReport } from "app/hooks/use-report";
import { useShareNFT } from "app/hooks/use-share-nft";
import { useUser } from "app/hooks/use-user";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";
import type { NFT } from "app/types";

const MenuItemIcon = ({ Icon, ...rest }: { Icon: ComponentType<SvgProps> }) => {
  return (
    <DropdownMenuItemIcon>
      <Icon width="1em" height="1em" color={colors.gray[500]} {...rest} />
    </DropdownMenuItemIcon>
  );
};

type Props = {
  nft?: NFT;
  shouldEnableSharing?: boolean;
  btnProps?: ButtonProps;
};

function NFTDropdown({
  nft: propNFT,
  shouldEnableSharing = true,
  btnProps,
}: Props) {
  //#region hooks
  const isDark = useIsDarkMode();
  const tabType = useProfileTabType();
  const { isAuthenticated } = useUser();
  const { report } = useReport();
  const { unfollow, isFollowing } = useMyInfo();
  const { hideNFT, unhideNFT } = useHideNFT();
  const { getIsBlocked, toggleBlock } = useBlock();
  const router = useRouter();
  // const { refresh } = useFeed("");
  const { data } = useNFTDetailByTokenId({
    contractAddress: propNFT?.contract_address,
    tokenId: propNFT?.token_id,
    chainName: propNFT?.chain_name,
  });

  const nft = data?.data.item;

  const isCreatorDrop = nft?.creator_airdrop_edition_address;
  const { shareNFT, shareNFTOnTwitter } = useShareNFT();
  const refreshMetadata = useRefreshMedadata();
  const navigateToLogin = useNavigateToLogin();
  //#endregion

  //#region variables
  const hasOwnership = nft?.is_user_owner;

  const isFollowingUser = useMemo(
    () => nft?.owner_id && isFollowing(nft?.creator_id),
    [nft?.creator_id, nft?.owner_id, isFollowing]
  );
  const isBlocked = useMemo(
    () => getIsBlocked(nft?.creator_id),
    [nft?.creator_id, getIsBlocked]
  );
  //#endregion

  const openModal = (modal: string) => {
    const as = `/nft/${nft?.chain_name}/${nft?.contract_address}/${nft?.token_id}/${modal}`;

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            chainName: nft?.chain_name,
            contractAddress: nft?.contract_address,
            tokenId: nft?.token_id,
            [`${modal}Modal`]: true,
          },
        } as any,
      }),
      Platform.select({
        native: as,
        web: router.asPath.startsWith("/nft/") ? as : router.asPath,
      }),
      Platform.select({
        native: {},
        web: { scroll: false },
      })
    );
  };

  const isShareAPIAvailable = Platform.select({
    default: true,
    web: typeof window !== "undefined" && !!navigator.share,
  });

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Button
          variant="text"
          tw="p-0"
          accessibilityLabel="nft card item menu"
          iconOnly
          {...btnProps}
        >
          <MoreHorizontal
            color={isDark ? "#FFF" : colors.gray[900]}
            width={24}
            height={24}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent loop>
        {tabType && tabType !== "hidden" ? (
          <DropdownMenuItem
            onSelect={() => {
              hideNFT(nft?.nft_id);
            }}
            key="hide"
          >
            <MenuItemIcon Icon={EyeOff} />
            <DropdownMenuItemTitle>Hide</DropdownMenuItemTitle>
          </DropdownMenuItem>
        ) : null}

        {tabType && tabType === "hidden" ? (
          <DropdownMenuItem
            onSelect={() => {
              unhideNFT(nft?.nft_id);
            }}
            key="unhide"
          >
            <MenuItemIcon Icon={EyeOff} />
            <DropdownMenuItemTitle>Unhide</DropdownMenuItemTitle>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuItem onSelect={() => openModal("activity")} key="activity">
          <MenuItemIcon Icon={Clock} />
          <DropdownMenuItemTitle>Activity</DropdownMenuItemTitle>
        </DropdownMenuItem>
        {shouldEnableSharing && (
          <>
            {!isShareAPIAvailable && (
              <DropdownMenuItem
                onSelect={() => shareNFTOnTwitter(nft)}
                key="share-twitter"
              >
                <MenuItemIcon Icon={Twitter} />

                <DropdownMenuItemTitle>Share on Twitter</DropdownMenuItemTitle>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={() => shareNFT(nft)} key="copy-link">
              <MenuItemIcon Icon={Copy} />

              <DropdownMenuItemTitle>
                {isShareAPIAvailable ? "Share" : "Copy Link"}
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          </>
        )}

        {!isCreatorDrop && (
          <DropdownMenuItem
            onSelect={() => refreshMetadata(nft)}
            key="refresh-metadata"
          >
            <MenuItemIcon Icon={Refresh} />

            <DropdownMenuItemTitle>Refresh Metadata</DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {!hasOwnership && isFollowingUser && (
          <DropdownMenuItem
            onSelect={async () => {
              if (isAuthenticated) {
                await unfollow(nft?.creator_id);
                // refresh();
              } else {
                navigateToLogin();
              }
            }}
            key="unfollow"
          >
            <MenuItemIcon Icon={UserMinus} />
            <DropdownMenuItemTitle>Unfollow User</DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {!hasOwnership ? (
          <DropdownMenuItem
            className="danger"
            key="block"
            onSelect={() =>
              toggleBlock({
                isBlocked,
                creatorId: nft?.creator_id,
                name: nft?.creator_name,
              })
            }
          >
            <MenuItemIcon Icon={Slash} />
            <DropdownMenuItemTitle>
              {isBlocked ? "Unblock User" : "Block User"}
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        ) : null}

        {!hasOwnership && (
          <DropdownMenuItem
            onSelect={async () => {
              await report({ nftId: nft?.nft_id });
              router.pop();
            }}
            key="report"
          >
            <MenuItemIcon Icon={Flag} />
            <DropdownMenuItemTitle>Report</DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { NFTDropdown };
