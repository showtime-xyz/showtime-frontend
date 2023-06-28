import { ComponentProps } from "react";
import { Platform, ViewStyle } from "react-native";

import * as DropdownMenu from "zeego/src/dropdown-menu";

import { styled } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

const reversalWebIconStyle: ViewStyle = Platform.select({
  web: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
  },
  default: {},
});
const DropdownMenuRoot = DropdownMenu.Root;

const DropdownMenuGroup = DropdownMenu.Group;

const DropdownMenuTrigger = DropdownMenu.Trigger;

const DropdownMenuSub = DropdownMenu.Sub;
const DropdownMenuSubContent = DropdownMenu.SubContent;

const StyledDropdownMenuContent = styled(DropdownMenu.Content);

const DropdownMenuContent = DropdownMenu.create(
  ({
    tw,
    ...props
  }: { tw?: TW } & ComponentProps<typeof DropdownMenu.Content>) => (
    <StyledDropdownMenuContent
      align="end"
      {...props}
      tw={["animate-zoom-in", tw].join(" ")}
    />
  ),
  "Content"
);

const StyledDropdownMenuItem = styled(DropdownMenu.Item);

const DropdownMenuItem = DropdownMenu.create(
  ({
    tw,
    children,
    style,
    ...props
  }: { tw?: TW; className?: string } & ComponentProps<
    typeof DropdownMenu.Item
  >) => {
    return (
      <StyledDropdownMenuItem
        {...props}
        style={[reversalWebIconStyle, style]}
        tw={Array.isArray(tw) ? tw.join(" ") : tw}
      >
        {children}
      </StyledDropdownMenuItem>
    );
  },
  "Item"
);

const StyledDropdownMenuItemTitle = styled(DropdownMenu.ItemTitle);

const DropdownMenuItemTitle = DropdownMenu.create(
  ({
    tw,
    ...props
  }: { tw?: TW } & ComponentProps<typeof Text> &
    ComponentProps<typeof DropdownMenu.ItemTitle>) => (
    <StyledDropdownMenuItemTitle
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
    >
      {props.children}
    </StyledDropdownMenuItemTitle>
  ),
  "ItemTitle"
);

const StyledDropdownMenuItemSubtitle = styled(DropdownMenu.ItemSubtitle);

const DropdownMenuItemSubtitle = DropdownMenu.create(
  ({
    tw,
    ...props
  }: { tw?: TW } & ComponentProps<typeof Text> &
    ComponentProps<typeof DropdownMenu.ItemSubtitle>) => (
    <StyledDropdownMenuItemSubtitle
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
    >
      {/* <Text {...props} /> */}
      {props.children}
    </StyledDropdownMenuItemSubtitle>
  ),
  "ItemSubtitle"
);

const StyledDropdownMenuItemIndicator = styled(DropdownMenu.ItemIndicator);

const DropdownMenuItemIndicator = DropdownMenu.create(
  ({
    tw,
    ...props
  }: { tw?: TW } & ComponentProps<typeof DropdownMenu.ItemIndicator>) => (
    <StyledDropdownMenuItemIndicator
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
    />
  ),
  "ItemIndicator"
);

const StyledDropdownMenuSeparator = styled(DropdownMenu.Separator);

const DropdownMenuSeparator = DropdownMenu.create(
  ({
    tw,
    ...props
  }: { tw?: TW } & ComponentProps<typeof DropdownMenu.Separator>) => (
    <StyledDropdownMenuSeparator
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
    />
  ),
  "Separator"
);

const StyledDropdownMenuSubTrigger = styled(DropdownMenu.SubTrigger);

const DropdownMenuSubTrigger = DropdownMenu.create(
  ({
    tw,
    children,
    style,
    ...props
  }: { tw?: TW } & ComponentProps<typeof DropdownMenu.SubTrigger>) => {
    return (
      <StyledDropdownMenuSubTrigger
        {...props}
        style={[reversalWebIconStyle, style]}
        tw={Array.isArray(tw) ? tw.join(" ") : tw}
      >
        {children}
      </StyledDropdownMenuSubTrigger>
    );
  },
  "SubTrigger"
);

const StyledDropdownMenuItemIcon = styled(DropdownMenu.ItemIcon);

const DropdownMenuItemIcon = DropdownMenu.create(
  ({
    tw,
    ...props
  }: { tw?: TW } & ComponentProps<typeof DropdownMenu.ItemIcon>) => (
    <StyledDropdownMenuItemIcon
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
    />
  ),
  "ItemIcon"
);

const StyledDropdownMenuItemImage = styled(DropdownMenu.ItemImage);

const DropdownMenuItemImage = DropdownMenu.create(
  ({
    tw,
    ...props
  }: { tw?: TW } & ComponentProps<typeof DropdownMenu.ItemImage>) => (
    <StyledDropdownMenuItemImage
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
    />
  ),
  "ItemImage"
);

const StyledDropdownMenuLabel = styled(DropdownMenu.Label);

const DropdownMenuLabel = DropdownMenu.create(
  ({
    tw,
    ...props
  }: { tw?: TW } & ComponentProps<typeof DropdownMenu.Label>) => (
    <StyledDropdownMenuLabel
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
    />
  ),
  "Label"
);

export {
  DropdownMenuRoot,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuItemSubtitle,
  DropdownMenuItemIndicator,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItemIcon,
  DropdownMenuItemImage,
  DropdownMenuLabel,
};
