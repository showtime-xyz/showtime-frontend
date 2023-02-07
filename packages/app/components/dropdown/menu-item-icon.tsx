import { ComponentType } from "react";
import { Platform } from "react-native";

import { SvgProps } from "react-native-svg";
import * as DropdownMenu from "zeego/src/dropdown-menu";
import type { MenuItemIconProps as ZeegoMenuItemIconProps } from "zeego/src/menu/types";

import { colors } from "@showtime-xyz/universal.tailwind";

import { DropdownMenuItemIcon } from "design-system/dropdown-menu";

type MenuItemIconProps = ZeegoMenuItemIconProps & {
  Icon: ComponentType<SvgProps>;
};

export const MenuItemIcon = DropdownMenu.menuify(
  ({ Icon, ...rest }: MenuItemIconProps) => {
    if (Platform.OS === "web") {
      return (
        <DropdownMenuItemIcon style={{ marginRight: 8 }}>
          <Icon width="1em" height="1em" color={colors.gray[500]} {...rest} />
        </DropdownMenuItemIcon>
      );
    }
    return <DropdownMenu.ItemIcon {...rest} />;
  },
  "ItemIcon"
);
