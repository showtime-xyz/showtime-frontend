import { Share } from "react-native";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "design-system/dropdown-menu";
import { View, Button } from "design-system";
import { MoreHorizontal } from "design-system/icon";
import { tw } from "design-system/tailwind";
import type { NFT } from "app/types";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { useReport } from "app/hooks/use-report";
import { useRouter } from "app/navigation/use-router";
import { CHAIN_IDENTIFIERS } from "app/lib/constants";

type Props = {
  nft?: NFT;
};

function NFTDropdown({ nft }: Props) {
  const userId = useCurrentUserId();
  const isOwner = Boolean(
    nft?.owner_id === userId ||
      nft?.multiple_owners_list?.find((owner) => owner.profile_id === userId)
  );
  const { report } = useReport();
  const router = useRouter();

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
          onSelect={() =>
            Share.share({
              url: `https://showtime.io/t/${tokenChainName}/${nft?.contract_address}/${nft?.token_id}`,
            })
          }
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
            onSelect={() => {}}
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
            onSelect={() => router.push(`/burn?nftId=${nft.nft_id}`)}
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
