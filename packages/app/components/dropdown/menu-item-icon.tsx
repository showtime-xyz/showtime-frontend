import { ComponentType } from "react";
import { Platform } from "react-native";

import type { ImageSystemSymbolConfiguration } from "react-native-ios-context-menu/lib/typescript/types/ImageItemConfig";
import { SvgProps } from "react-native-svg";
import * as DropdownMenu from "zeego/src/dropdown-menu";
import type { MenuItemIconProps as ZeegoMenuItemIconProps } from "zeego/src/menu/types";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { colors } from "@showtime-xyz/universal.tailwind";

import { DropdownMenuItemIcon } from "design-system/dropdown-menu";

type MenuItemIconProps = Omit<ZeegoMenuItemIconProps, "ios"> & {
  Icon: ComponentType<SvgProps>;
  ios?: ImageSystemSymbolConfiguration & {
    name: any;
  };
};

export const MenuItemIcon = DropdownMenu.menuify(
  ({ Icon, ...rest }: MenuItemIconProps) => {
    const isDark = useIsDarkMode();
    if (Platform.OS === "web") {
      return (
        <DropdownMenuItemIcon style={{ marginRight: 8 }}>
          <Icon
            width="1em"
            height="1em"
            color={isDark ? colors.neutral[200] : colors.gray[600]}
            {...rest}
          />
        </DropdownMenuItemIcon>
      );
    }
    return <DropdownMenu.ItemIcon {...rest} />;
  },
  "ItemIcon"
);
