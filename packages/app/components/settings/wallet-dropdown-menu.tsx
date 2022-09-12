import { Button } from "@showtime-xyz/universal.button";
import { Check, Edit, MoreHorizontal } from "@showtime-xyz/universal.icon";

import { MenuItemIcon } from "app/components/dropdown/menu-item-icon";
import { useSetPrimaryWallet } from "app/hooks/api/use-set-primary-wallet";
import { useManageAccount } from "app/hooks/use-manage-account";
import { WalletAddressesExcludingEmailV2 } from "app/types";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";
import { Trash } from "design-system/icon";

type AddressMenuProps = {
  address?: WalletAddressesExcludingEmailV2["address"] | undefined | null;
  isCurrent: boolean;
  onEditNickname: (address: string) => void;
  isPrimary?: boolean;
};

export const WalletDropdownMenu = (props: AddressMenuProps) => {
  const { removeAccount } = useManageAccount();
  const address = props.address;
  const { setPrimaryWallet } = useSetPrimaryWallet();

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Button iconOnly={true} variant="tertiary">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent loop>
        <DropdownMenuItem
          onSelect={() => address && props.onEditNickname(address)}
          key="nickname"
        >
          <MenuItemIcon Icon={Edit} />
          <DropdownMenuItemTitle>Edit nickname</DropdownMenuItemTitle>
        </DropdownMenuItem>

        {!props.isPrimary ? (
          <DropdownMenuItem
            onSelect={() => address && setPrimaryWallet(address)}
            key="primary"
          >
            <MenuItemIcon Icon={Check} />
            <DropdownMenuItemTitle>Make Primary</DropdownMenuItemTitle>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuItem
          // @ts-ignore
          onSelect={() => removeAccount(address)}
          className="danger"
          key="your-profile"
          destructive
        >
          <MenuItemIcon Icon={Trash} />
          <DropdownMenuItemTitle>Delete Wallet</DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
};
