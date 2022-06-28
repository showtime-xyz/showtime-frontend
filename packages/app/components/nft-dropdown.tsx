import { useMemo } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { tw } from "@showtime-xyz/universal.tailwind";

import { useMyInfo } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { useFeed } from "app/hooks/use-feed";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useRefreshMedadata } from "app/hooks/use-refresh-metadata";
import { useReport } from "app/hooks/use-report";
import { useShareNFT } from "app/hooks/use-share-nft";
import { useUser } from "app/hooks/use-user";
import { SHOWTIME_CONTRACTS } from "app/lib/constants";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";
import type { NFT } from "app/types";
import { findListingItemByOwner, isUserAnOwner } from "app/utilities";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuItemIcon,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";
import {
  MoreHorizontal,
  Trash,
  File,
  UserMinus,
  Flag,
  Transfer,
  EyeOff,
  Copy,
  Slash,
  Refresh,
  Clock,
  Menu,
} from "design-system/icon";

const MenuItemIcon = ({ Icon }) => {
  return (
    <DropdownMenuItemIcon>
      <Icon
        width="1em"
        height="1em"
        color={
          tw.style("bg-gray-400 dark:bg-gray-500")?.backgroundColor as string
        }
      />
    </DropdownMenuItemIcon>
  );
};

type Props = {
  nft?: NFT;
  listId?: number | undefined;
  shouldEnableSharing?: boolean;
};

function NFTDropdown({
  nft: propNFT,
  listId,
  shouldEnableSharing = true,
}: Props) {
  //#region hooks
  const userId = useCurrentUserId();
  const { user, isAuthenticated } = useUser();
  const { report } = useReport();
  const { unfollow, isFollowing, hide: hideNFT } = useMyInfo();
  const { getIsBlocked, toggleBlock } = useBlock();
  const router = useRouter();
  const { refresh } = useFeed("");
  const { data } = useNFTDetailByTokenId({
    contractAddress: propNFT?.contract_address,
    tokenId: propNFT?.token_id,
    chainName: propNFT?.chain_name,
  });

  const nft = data?.data.item;

  const isCreatorDrop = nft?.creator_airdrop_edition_address;
  const shareNFT = useShareNFT();
  const refreshMetadata = useRefreshMedadata();
  const navigateToLogin = useNavigateToLogin();
  //#endregion

  //#region variables
  const hasMatchingListing = findListingItemByOwner(nft, userId);
  const hasOwnership = isUserAnOwner(
    user?.data.profile.wallet_addresses_v2,
    nft?.multiple_owners_list
  );

  // Prevent web3 actions on incorrect contracts caused by environment syncs
  const usableContractAddress = SHOWTIME_CONTRACTS.includes(
    nft?.contract_address
  );

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
        <MoreHorizontal
          color={
            tw.style("bg-gray-600 dark:bg-gray-400")?.backgroundColor as string
          }
          width={24}
          height={24}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent loop>
        {hasOwnership && listId ? (
          <DropdownMenuItem
            onSelect={() => {
              hideNFT(nft?.nft_id, listId);
            }}
            key="hide"
          >
            <MenuItemIcon Icon={EyeOff} />
            <DropdownMenuItemTitle>Hide</DropdownMenuItemTitle>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuItem onSelect={() => openModal("details")} key="details">
          <MenuItemIcon Icon={File} />
          <DropdownMenuItemTitle>Details</DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => openModal("activity")} key="activity">
          <MenuItemIcon Icon={Clock} />
          <DropdownMenuItemTitle>Activity</DropdownMenuItemTitle>
        </DropdownMenuItem>

        {shouldEnableSharing && Platform.OS !== "ios" ? (
          <DropdownMenuItem onSelect={() => shareNFT(nft)} key="copy-link">
            <MenuItemIcon Icon={Copy} />

            <DropdownMenuItemTitle>
              {isShareAPIAvailable ? "Share" : "Copy Link"}
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        ) : null}

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
                refresh();
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
              await report({ nftId: nft?.token_id });
              router.pop();
            }}
            key="report"
          >
            <MenuItemIcon Icon={Flag} />
            <DropdownMenuItemTitle>Report</DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {hasOwnership && !isCreatorDrop && (
          <DropdownMenuItem
            onSelect={() => openModal("transfer")}
            key="transfer"
          >
            <MenuItemIcon Icon={Transfer} />
            <DropdownMenuItemTitle>Transfer</DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {hasOwnership &&
          usableContractAddress &&
          !hasMatchingListing &&
          !isCreatorDrop && (
            <DropdownMenuItem onSelect={() => openModal("list")} key="list">
              <MenuItemIcon Icon={Menu} />
              <DropdownMenuItemTitle>List</DropdownMenuItemTitle>
            </DropdownMenuItem>
          )}

        {hasOwnership &&
          usableContractAddress &&
          hasMatchingListing &&
          !isCreatorDrop && (
            <DropdownMenuItem onSelect={() => openModal("unlist")} key="unlist">
              <DropdownMenuItemTitle>Unlist</DropdownMenuItemTitle>
            </DropdownMenuItem>
          )}

        {hasOwnership && !isCreatorDrop && (
          <DropdownMenuItem
            className="danger"
            destructive
            onSelect={() => openModal("delete")}
            key="delete"
          >
            <MenuItemIcon Icon={Trash} />
            <DropdownMenuItemTitle>Delete</DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { NFTDropdown };
