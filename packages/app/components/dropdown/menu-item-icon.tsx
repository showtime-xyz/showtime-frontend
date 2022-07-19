import { ComponentType } from "react";

import { SvgProps } from "react-native-svg";

import { DropdownMenuItemIcon } from "@showtime-xyz/universal.dropdown-menu";
import { tw } from "@showtime-xyz/universal.tailwind";

type MenuItemIconProps = {
  Icon: ComponentType<SvgProps>;
};

export const MenuItemIcon = ({ Icon, ...rest }: MenuItemIconProps) => {
  return (
    <DropdownMenuItemIcon>
      <Icon
        width="1em"
        height="1em"
        color={tw.style("bg-gray-500")?.backgroundColor as string}
        {...rest}
      />
    </DropdownMenuItemIcon>
  );
};
