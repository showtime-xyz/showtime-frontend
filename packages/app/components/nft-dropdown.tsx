import { useState, useEffect } from "react";

import { useSWRConfig } from "swr";

import { useMyInfo } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
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
  nft?: NFT;
};

function NFTDropdown({ nft }: Props) {
  const { mutate } = useSWRConfig();
  const userId = useCurrentUserId();
  const { user, isAuthenticated } = useUser();
  const { userAddress } = useCurrentUserAddress();
  const [isOwner, setIsOwner] = useState(false);
  const { report } = useReport();
  const { unfollow } = useMyInfo();
  const { block } = useBlock();
  const router = useRouter();

  useEffect(() => {
    if (nft?.owner_address) {
      setIsOwner(nft.owner_address.toLowerCase() === userAddress.toLowerCase());
    }
  }, [nft, userAddress]);

  const hasMatchingListing = findListingItemByOwner(nft, userId);
  const hasOwnership = isUserAnOwner(
    user?.data.profile.wallet_addresses_v2,
    nft?.multiple_owners_list
  );

  // Prevent web3 actions on incorrect contracts caused by environment syncs
  const usableContractAddress = SHOWTIME_CONTRACTS.includes(
    nft?.contract_address
  );

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
          onSelect={() => router.push(`/nft/${nft?.nft_id}/details`)}
          key="details"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Details
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

        {isAuthenticated && (
          <DropdownMenuItem
            onSelect={async () => {
              await unfollow(nft?.owner_id);
              mutate(null);
            }}
            key="unfollow"
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Unfollow User
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {isAuthenticated && (
          <DropdownMenuSeparator tw="h-[1px] m-1 bg-gray-200 dark:bg-gray-700" />
        )}

        {!isOwner && (
          <DropdownMenuItem
            onSelect={async () => {
              if (isAuthenticated) {
                await block(nft?.owner_id);
                mutate(null);
              } else {
                router.push("/login");
              }
            }}
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
            key="block"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Block User
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

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
            onSelect={() => router.push(`/nft/${nft?.nft_id}/transfer`)}
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
            onSelect={() => router.push(`/nft/${nft?.nft_id}/list`)}
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
            onSelect={() => {}}
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
            onSelect={() => router.push(`/burn?nftId=${nft?.nft_id}`)}
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
