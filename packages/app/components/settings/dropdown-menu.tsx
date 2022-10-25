import { Button } from "@showtime-xyz/universal.button";
import { MoreHorizontal } from "@showtime-xyz/universal.icon";

import { MenuItemIcon } from "app/components/dropdown/menu-item-icon";
import { WalletAddressesV2 } from "app/types";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";
import { Trash } from "design-system/icon";

type AddressMenuProps = {
  email?: WalletAddressesV2["email"];
  ctaCopy: string;
  isCurrent: boolean;
  onRemove?: () => void;
};

export const DropdownMenu = (props: AddressMenuProps) => {
  const ctaCopy = props.ctaCopy;
  const disable = props.isCurrent || props.isCurrent === undefined;

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Button iconOnly={true} variant="tertiary">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent loop>
        <DropdownMenuItem
          // @ts-ignore
          onSelect={props.onRemove}
          className="danger"
          disabled={disable}
          key="your-profile"
          destructive
        >
          <MenuItemIcon Icon={Trash} />
          <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
            {ctaCopy}
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
};
