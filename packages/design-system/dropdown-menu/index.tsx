import { ComponentProps, useMemo, useCallback } from "react";
import { Platform } from "react-native";

import { MotiView } from "moti";
import Animated, {
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import * as DropdownMenu from "zeego/dropdown-menu";

import { styled } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

const DropdownMenuRoot = DropdownMenu.Root;

const DropdownMenuGroup = DropdownMenu.Group;

const DropdownMenuTrigger = DropdownMenu.Trigger;

const DropdownMenuSub = DropdownMenu.Sub;
// Todo: zeego issue on Android, have created a PR: https://github.com/nandorojo/zeego/pull/27, waiting for merge and release.
const DropdownMenuSubContent =
  Platform.OS === "android" ? DropdownMenu.Content : DropdownMenu.SubContent;

const StyledDropdownMenuContent = styled(DropdownMenu.Content);

const DropdownMenuContent = DropdownMenu.menuify(
  ({
    tw,
    ...props
  }: { tw?: TW } & ComponentProps<typeof DropdownMenu.Content>) => (
    <StyledDropdownMenuContent
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
    />
  ),
  "Content"
);

const DropdownItemFocusRing = ({
  isFocused,
}: {
  isFocused: Animated.SharedValue<boolean>;
}) => {
  // TODO moti should provide this
  const state = useDerivedValue(() => {
    return {
      opacity: isFocused.value ? 1 : 0,
    };
  }, [isFocused]);

  return (
    <MotiView
      animate={state}
      transition={useMemo(
        () => ({
          type: "timing",
          duration: 150,
        }),
        []
      )}
      pointerEvents="none"
    />
  );
};

const useFocusedItem = ({
  onFocus,
  onBlur,
}: {
  onFocus?: () => void;
  onBlur?: () => void;
}) => {
  const isFocused = useSharedValue(false);

  const handleFocus = useCallback(() => {
    isFocused.value = true;
    onFocus?.();
  }, [isFocused, onFocus]);

  const handleBlur = useCallback(() => {
    isFocused.value = false;
    onBlur?.();
  }, [isFocused, onBlur]);

  return {
    isFocused,
    handleFocus,
    handleBlur,
  };
};

const StyledDropdownMenuItem = styled(DropdownMenu.Item);

const DropdownMenuItem = DropdownMenu.menuify(
  ({
    tw,
    children,
    onBlur,
    onFocus,
    ...props
  }: { tw?: TW; className?: string } & ComponentProps<
    typeof DropdownMenu.Item
  >) => {
    const { isFocused, handleBlur, handleFocus } = useFocusedItem({
      onFocus,
      onBlur,
    });

    return (
      <StyledDropdownMenuItem
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tw={Array.isArray(tw) ? tw.join(" ") : tw}
      >
        <DropdownItemFocusRing isFocused={isFocused} />
        {children}
      </StyledDropdownMenuItem>
    );
  },
  "Item"
);

// const StyledDropdownMenuCheckboxItem = styled(DropdownMenu.CheckboxItem);

// const DropdownMenuCheckboxItem = DropdownMenu.menuify(
//   ({
//     tw,
//     children,
//     onBlur,
//     onFocus,
//     ...props
//   }: { tw?: TW } & ComponentProps<typeof DropdownMenu.CheckboxItem>) => {
//     const { isFocused, handleBlur, handleFocus } = useFocusedItem({
//       onFocus,
//       onBlur,
//     });

//     return (
//       <StyledDropdownMenuCheckboxItem
//         {...props}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         tw={Array.isArray(tw) ? tw.join(" ") : tw}
//       >
//         <DropdownItemFocusRing isFocused={isFocused} />
//         <DropdownMenu.ItemIndicator>
//           {/* <Icon name="checkmark" color="textContrast" /> */}
//         </DropdownMenu.ItemIndicator>
//         {children}
//       </StyledDropdownMenuCheckboxItem>
//     );
//   },
//   "CheckboxItem"
// );

const StyledDropdownMenuItemTitle = styled(DropdownMenu.ItemTitle);

const DropdownMenuItemTitle = DropdownMenu.menuify(
  ({
    tw,
    ...props
  }: { tw?: TW } & ComponentProps<typeof Text> &
    ComponentProps<typeof DropdownMenu.ItemTitle>) => (
    <StyledDropdownMenuItemTitle
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
    >
      {/* <Text {...props} /> */}
      {props.children}
    </StyledDropdownMenuItemTitle>
  ),
  "ItemTitle"
);

const StyledDropdownMenuItemSubtitle = styled(DropdownMenu.ItemSubtitle);

const DropdownMenuItemSubtitle = DropdownMenu.menuify(
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

const DropdownMenuItemIndicator = DropdownMenu.menuify(
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

const DropdownMenuSeparator = DropdownMenu.menuify(
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

const DropdownMenuSubTrigger = DropdownMenu.menuify(
  ({
    tw,
    children,
    onBlur,
    onFocus,
    ...props
  }: { tw?: TW } & ComponentProps<typeof DropdownMenu.SubTrigger>) => {
    const { isFocused, handleBlur, handleFocus } = useFocusedItem({
      onFocus,
      onBlur,
    });

    return (
      <StyledDropdownMenuSubTrigger
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tw={Array.isArray(tw) ? tw.join(" ") : tw}
      >
        <DropdownItemFocusRing isFocused={isFocused} />
        {children}
      </StyledDropdownMenuSubTrigger>
    );
  },
  "SubTrigger"
);

const StyledDropdownMenuItemIcon = styled(DropdownMenu.ItemIcon);

const DropdownMenuItemIcon = DropdownMenu.menuify(
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

const DropdownMenuItemNativeIcon = DropdownMenu.menuify(() => {
  if (Platform.OS === "web") {
    return <></>;
  }
  return DropdownMenu.ItemIcon;
}, "ItemIcon");

const StyledDropdownMenuItemImage = styled(DropdownMenu.ItemImage);

const DropdownMenuItemImage = DropdownMenu.menuify(
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

const DropdownMenuLabel = DropdownMenu.menuify(
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
  // DropdownMenuCheckboxItem,
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
  DropdownMenuItemNativeIcon,
};
