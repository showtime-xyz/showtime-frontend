import { useState, useEffect } from "react";
import { Share } from "react-native";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { useReport } from "app/hooks/use-report";
import { useUser } from "app/hooks/use-user";
import { track } from "app/lib/analytics";
import { CHAIN_IDENTIFIERS } from "app/lib/constants";
import { SHOWTIME_CONTRACTS } from "app/lib/constants";
import { useRouter } from "app/navigation/use-router";
import type { NFT } from "app/types";
import { findListingItemByOwner, isUserAnOwner } from "app/utilities";

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
  const userId = useCurrentUserId();
  const { user } = useUser();
  const { userAddress } = useCurrentUserAddress();
  const [isOwner, setIsOwner] = useState(false);

  const { report } = useReport();
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

  const tokenChainName = Object.keys(CHAIN_IDENTIFIERS).find(
    (key) => CHAIN_IDENTIFIERS[key] == nft?.chain_identifier
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
          onSelect={async () => {
            const share = await Share.share({
              url: `https://showtime.io/t/${tokenChainName}/${nft?.contract_address}/${nft?.token_id}`,
            });

            if (share.action === "sharedAction") {
              track(
                "NFT Shared",
                share.activityType ? { type: share.activityType } : undefined
              );
            }
          }}
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
