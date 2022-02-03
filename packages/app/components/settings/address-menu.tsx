import { Text, Button } from "design-system";
import { MoreHorizontal } from "design-system/icon";
import { WalletAddressesExcludingEmailV2, WalletAddressesV2 } from "app/types";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";
import { axios } from "app/lib/axios";

type AddressMenuProps = {
  address?: WalletAddressesExcludingEmailV2["address"];
  email?: WalletAddressesV2["email"];
  ctaCopy: string;
};

export const AddressMenu = (props: AddressMenuProps) => {
  const address = props.address;
  const ctaCopy = props.ctaCopy;

  const removeAddress = async () => {
    try {
      await axios({
        url: "/v1/removewallet",
        method: "POST",
        data: { address },
      });
    } catch (error) {
      // TODO: handle error recovery
      console.log("error", error);
    }
  };
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
          onSelect={removeAddress}
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
