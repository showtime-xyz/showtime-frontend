import { useMemo } from "react";
import { Platform } from "react-native";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@showtime-xyz/universal.dropdown-menu";
import { MoreHorizontal } from "@showtime-xyz/universal.icon";
import { tw } from "@showtime-xyz/universal.tailwind";

import { useMyInfo } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { useFeed } from "app/hooks/use-feed";
import { useNFTDetails } from "app/hooks/use-nft-details";
import { useRefreshMedadata } from "app/hooks/use-refresh-metadata";
import { useReport } from "app/hooks/use-report";
import { useShareNFT } from "app/hooks/use-share-nft";
import { useUser } from "app/hooks/use-user";
import { SHOWTIME_CONTRACTS } from "app/lib/constants";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";
import { useRouter } from "app/navigation/use-router";
import type { NFT } from "app/types";
import { findListingItemByOwner, isUserAnOwner } from "app/utilities";

type Props = {
  nftId?: NFT["nft_id"];
  listId?: number | undefined;
  shouldEnableSharing?: boolean;
};

function NFTDropdown({ nftId, listId, shouldEnableSharing = true }: Props) {
  //#region hooks
  const userId = useCurrentUserId();
  const { user, isAuthenticated } = useUser();
  const { report } = useReport();
  const { unfollow, isFollowing, hide: hideNFT } = useMyInfo();
  const { getIsBlocked, toggleBlock } = useBlock();
  const router = useRouter();
  const { refresh } = useFeed("");
  const { data: nft } = useNFTDetails(nftId);
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
      }),
      { shallow: true }
    );
  };

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <MoreHorizontal
          color={tw.style("bg-black dark:bg-white")?.backgroundColor as string}
          width={24}
          height={24}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        loop
        tw="w-60 rounded-2xl bg-white p-2 shadow dark:bg-gray-900"
      >
        {hasOwnership ? (
          <>
            <DropdownMenuItem
              onSelect={() => {
                hideNFT(nftId, listId);
              }}
              key="details"
              tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
            >
              <DropdownMenuItemTitle tw="font-semibold text-black dark:text-white">
                Hide
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />
          </>
        ) : null}

        <DropdownMenuItem
          onSelect={() => openModal("details")}
          key="details"
          tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
        >
          <DropdownMenuItemTitle tw="font-semibold text-black dark:text-white">
            Details
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem
          onSelect={() => openModal("activities")}
          key="activities"
          tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
        >
          <DropdownMenuItemTitle tw="font-semibold text-black dark:text-white">
            Activity
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        {shouldEnableSharing && Platform.OS !== "ios" ? (
          <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />
        ) : null}

        {shouldEnableSharing && Platform.OS !== "ios" ? (
          <DropdownMenuItem
            onSelect={() => shareNFT(nft)}
            key="copy-link"
            tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
          >
            <DropdownMenuItemTitle tw="font-semibold text-black dark:text-white">
              Share
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem
          onSelect={() => refreshMetadata(nft)}
          key="refresh-metadata"
          tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
        >
          <DropdownMenuItemTitle tw="font-semibold text-black dark:text-white">
            Refresh Metadata
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

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
            tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
          >
            <DropdownMenuItemTitle tw="font-semibold text-black dark:text-white">
              Unfollow User
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {!hasOwnership && (
          <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />
        )}

        {!hasOwnership ? (
          <DropdownMenuItem
            key="block"
            tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
            onSelect={() =>
              toggleBlock({
                isBlocked,
                creatorId: nft?.creator_id,
                name: nft?.creator_name,
              })
            }
          >
            <DropdownMenuItemTitle tw="font-semibold text-black dark:text-white">
              {isBlocked ? "Unblock User" : "Block User"}
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        ) : null}

        {!hasOwnership && (
          <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />
        )}

        {!hasOwnership && (
          <DropdownMenuItem
            onSelect={async () => {
              await report({ nftId: nft?.token_id });
              router.pop();
            }}
            key="report"
            tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
          >
            <DropdownMenuItemTitle tw="font-semibold text-black dark:text-white">
              Report
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {hasOwnership && (
          <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />
        )}

        {hasOwnership && (
          <DropdownMenuItem
            onSelect={() => openModal("transfer")}
            key="transfer"
            tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
          >
            <DropdownMenuItemTitle tw="font-semibold text-black dark:text-white">
              Transfer
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {hasOwnership && usableContractAddress && !hasMatchingListing && (
          <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />
        )}

        {hasOwnership && usableContractAddress && !hasMatchingListing && (
          <DropdownMenuItem
            onSelect={() => openModal("list")}
            key="list"
            tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
          >
            <DropdownMenuItemTitle tw="font-semibold text-black dark:text-white">
              List
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {hasOwnership && usableContractAddress && hasMatchingListing && (
          <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />
        )}

        {hasOwnership && usableContractAddress && hasMatchingListing && (
          <DropdownMenuItem
            onSelect={() => openModal("unlist")}
            key="unlist"
            tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
          >
            <DropdownMenuItemTitle tw="font-semibold text-black dark:text-white">
              Unlist
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {hasOwnership && (
          <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />
        )}

        {hasOwnership && (
          <DropdownMenuItem
            destructive
            onSelect={() => openModal("delete")}
            key="delete"
            tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
          >
            <DropdownMenuItemTitle tw="font-semibold text-black dark:text-white">
              Delete
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { NFTDropdown };
