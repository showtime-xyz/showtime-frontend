import { useState, useEffect, useMemo, useCallback } from "react";
import { Platform } from "react-native";

import { useSWRConfig } from "swr";

import { useMyInfo } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { useFeed } from "app/hooks/use-feed";
import { useNFTDetails } from "app/hooks/use-nft-details";
import { useReport } from "app/hooks/use-report";
import { useUser } from "app/hooks/use-user";
import { SHOWTIME_CONTRACTS } from "app/lib/constants";
import { useRouter } from "app/navigation/use-router";
import type { NFT } from "app/types";
import {
  findListingItemByOwner,
  isUserAnOwner,
  handleShareNFT,
} from "app/utilities";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "design-system/dropdown-menu";
import { MoreHorizontal } from "design-system/icon";
import { tw } from "design-system/tailwind";

type Props = {
  nftId?: NFT["nft_id"];
};

function NFTDropdown({ nftId }: Props) {
  //#region hooks
  const { mutate } = useSWRConfig();
  const userId = useCurrentUserId();
  const { user, isAuthenticated } = useUser();
  const { userAddress } = useCurrentUserAddress();
  const [isOwner, setIsOwner] = useState(false);
  const { report } = useReport();
  const { unfollow, isFollowing } = useMyInfo();
  const { getIsBlocked, unblock, block } = useBlock();
  const router = useRouter();
  const { refresh } = useFeed("");
  const { data: nft } = useNFTDetails(nftId);
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
    [nft?.creator_id, isFollowing]
  );
  const isBlocked = useMemo(
    () => getIsBlocked(nft?.creator_id),
    [nft?.creator_id, getIsBlocked]
  );
  //#endregion

  //#region callback
  const handleOnBlockPress = async () => {
    if (isAuthenticated) {
      await block(nft?.creator_id);
    } else {
      router.push(
        Platform.select({
          native: "/login",
          web: {
            pathname: router.pathname,
            query: { ...router.query, login: true },
          },
        }),
        "/login",
        { shallow: true }
      );
    }
  };
  const handleOnUnblockPress = async () => {
    if (isAuthenticated) {
      await unblock(nft?.creator_id);
    } else {
      router.push(
        Platform.select({
          native: "/login",
          web: {
            pathname: router.pathname,
            query: { ...router.query, login: true },
          },
        }),
        "/login",
        { shallow: true }
      );
    }
  };
  //#endregion

  //#region effects
  useEffect(() => {
    if (nft?.owner_address) {
      setIsOwner(nft.owner_address.toLowerCase() === userAddress.toLowerCase());
    }
  }, [nft, userAddress]);
  //#endregion

  const handleNavigateRoute = (as: string, matchingRoute: string) => {
    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: { ...router.query, id: nftId, [matchingRoute]: true },
        },
      }),
      as,
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
        tw="w-60 p-2 bg-white dark:bg-gray-900 rounded-2xl shadow"
      >
        <DropdownMenuItem
          onSelect={() => {
            handleNavigateRoute(`/nft/${nftId}/details`, "details");
          }}
          key="details"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Details
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => {
            handleNavigateRoute(`/nft/${nftId}/activities`, "nftActivities");
          }}
          key="nftActivities"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Activity
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuSeparator tw="h-[1px] m-1 bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem
          onSelect={() => handleShareNFT(nft)}
          key="copy-link"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Share
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuSeparator tw="h-[1px] m-1 bg-gray-200 dark:bg-gray-700" />

        {/* <DropdownMenuItem
          onSelect={() => {}}
          key="refresh-metadata"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Refresh Metadata
          </DropdownMenuItemTitle>
        </DropdownMenuItem> */}

        {!isOwner && isFollowingUser && (
          <DropdownMenuItem
            onSelect={async () => {
              if (isAuthenticated) {
                await unfollow(nft?.creator_id);
                refresh();
              } else {
                router.push(
                  Platform.select({
                    native: "/login",
                    web: {
                      pathname: router.pathname,
                      query: { ...router.query, login: true },
                    },
                  }),
                  "/login",
                  { shallow: true }
                );
              }
            }}
            key="unfollow"
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Unfollow User
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator tw="h-[1px] m-1 bg-gray-200 dark:bg-gray-700" />

        {!isOwner ? (
          !isBlocked ? (
            <DropdownMenuItem
              key="block"
              tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
              onSelect={handleOnBlockPress}
            >
              <DropdownMenuItemTitle tw="text-black dark:text-white">
                Block User
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              key="unblock"
              tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
              onSelect={handleOnUnblockPress}
            >
              <DropdownMenuItemTitle tw="text-black dark:text-white">
                Unblock User
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          )
        ) : null}

        {!isOwner && (
          <DropdownMenuItem
            onSelect={async () => {
              await report({ nftId: nft?.token_id });
              router.pop();
            }}
            key="report"
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Report
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {isOwner && (
          <DropdownMenuItem
            onSelect={() => {
              const as = `/nft/${nftId}/transfer`;

              router.push(
                Platform.select({
                  native: as,
                  web: {
                    pathname: router.pathname,
                    query: { ...router.query, transfer: true, id: nftId },
                  },
                }),
                as,
                { shallow: true }
              );
            }}
            key="transfer"
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Transfer
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {hasOwnership && usableContractAddress && !hasMatchingListing && (
          <DropdownMenuItem
            onSelect={() => {
              const as = `/nft/${nftId}/list`;

              router.push(
                Platform.select({
                  native: as,
                  web: {
                    pathname: router.pathname,
                    query: { ...router.query, list: true, id: nftId },
                  },
                }),
                as,
                { shallow: true }
              );
            }}
            key="list"
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              List
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {hasOwnership && usableContractAddress && hasMatchingListing && (
          <DropdownMenuItem
            onSelect={() => {
              const as = `/nft/${nftId}/unlist`;

              router.push(
                Platform.select({
                  native: as,
                  web: {
                    pathname: router.pathname,
                    query: { ...router.query, unlist: true, id: nftId },
                  },
                }),
                as,
                { shallow: true }
              );
            }}
            key="unlist"
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Unlist
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {isOwner && (
          <DropdownMenuItem
            destructive
            onSelect={() => {
              const as = `/nft/${nftId}/delete`;

              router.push(
                Platform.select({
                  native: as,
                  web: {
                    pathname: router.pathname,
                    query: { ...router.query, delete: true, id: nftId },
                  },
                }),
                as,
                { shallow: true }
              );
            }}
            key="delete"
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Delete
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { NFTDropdown };
