import { useState, useEffect } from "react";
import { Share } from "react-native";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useReport } from "app/hooks/use-report";
import { track } from "app/lib/analytics";
import { CHAIN_IDENTIFIERS } from "app/lib/constants";
import { useRouter } from "app/navigation/use-router";
import type { NFT } from "app/types";

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

import { handleShareNFT } from "../utilities";

type Props = {
  nft?: NFT;
};

function NFTDropdown({ nft }: Props) {
  const { userAddress } = useCurrentUserAddress();
  const [isOwner, setIsOwner] = useState(false);

  const { report } = useReport();
  const router = useRouter();

  useEffect(() => {
    if (nft?.owner_address) {
      setIsOwner(nft.owner_address.toLowerCase() === userAddress.toLowerCase());
    }
  }, [nft, userAddress]);

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
