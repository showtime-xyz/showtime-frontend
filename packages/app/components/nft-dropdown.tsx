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

type Props = {
  nft: NFT;
};

function NFTDropdown({ nft }: Props) {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <View tw="w-8 h-8">
          <Button variant="tertiary" tw="h-8 rounded-full p-2" iconOnly={true}>
            <MoreHorizontal
              width={24}
              height={24}
              color={
                tw.style("bg-black dark:bg-white")?.backgroundColor as string
              }
            />
          </Button>
        </View>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        loop
        tw="w-60 p-2 bg-white dark:bg-gray-900 rounded-2xl shadow"
      >
        <DropdownMenuItem
          onSelect={() => {}}
          key="transfer"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Transfer
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuSeparator tw="h-[1px] m-1 bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem
          destructive
          onSelect={() => {}}
          key="delete"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Delete
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { NFTDropdown };
