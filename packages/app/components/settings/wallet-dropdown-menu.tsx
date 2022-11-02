import { Linking } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Edit, MoreHorizontal, Wallet } from "@showtime-xyz/universal.icon";

import { MenuItemIcon } from "app/components/dropdown/menu-item-icon";
import { useManageAccount } from "app/hooks/use-manage-account";
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
  address?: WalletAddressesV2["address"] | undefined | null;
  isCurrent: boolean;
  onEditNickname: (item: WalletAddressesV2) => void;
  isMagicWallet: boolean;
};

export const WalletDropdownMenu = (props: AddressMenuProps) => {
  const { removeAccount } = useManageAccount();
  const address = props.address;

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Button iconOnly={true} variant="tertiary">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent loop>
        <DropdownMenuItem onSelect={props.onEditNickname} key="nickname">
          <MenuItemIcon Icon={Edit} />
          <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
            Edit nickname
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
        {props.isMagicWallet ? (
          <DropdownMenuItem
            onSelect={() =>
              Linking.openURL("https://reveal.magic.link/showtime")
            }
            key="export_key"
          >
            <MenuItemIcon Icon={Wallet} />

            <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
              Export Private Key
            </DropdownMenuItemTitle>
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
          <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
            Delete Wallet
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
};
