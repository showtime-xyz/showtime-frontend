import { useManageAccount } from "app/hooks/use-manage-account";
import { WalletAddressesExcludingEmailV2, WalletAddressesV2 } from "app/types";

import { Button } from "design-system";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";
import { MoreHorizontal } from "design-system/icon";

type AddressMenuProps = {
  address?: WalletAddressesExcludingEmailV2["address"] | undefined | null;
  email?: WalletAddressesV2["email"];
  ctaCopy: string;
  isCurrent: boolean;
};

export const AddressMenu = (props: AddressMenuProps) => {
  const { removeAccount } = useManageAccount();
  const address = props.address;
  const ctaCopy = props.ctaCopy;
  const disable = props.isCurrent || props.isCurrent === undefined;

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Button iconOnly={true} variant="tertiary" asChild>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        loop
        tw="w-60 p-2 bg-white dark:bg-gray-900 rounded-2xl shadow"
      >
        <DropdownMenuItem
          // @ts-ignore
          onSelect={() => removeAccount(address)}
          disabled={disable}
          key="your-profile"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
          destructive
        >
          <DropdownMenuItemTitle>{ctaCopy}</DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
};
