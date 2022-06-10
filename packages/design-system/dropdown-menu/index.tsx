import { ComponentProps, useMemo, useCallback } from "react";
import { Platform } from "react-native";

import { MotiView } from "moti";
import Animated, {
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { tw as tailwind } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import * as DropdownMenu from "./zeego-menu/dropdown-menu/src/index";

const IS_WEB = Platform.OS === "web";

const DropdownMenuRoot = DropdownMenu.Root;

const DropdownMenuGroup = DropdownMenu.Group;

const DropdownMenuTrigger = DropdownMenu.Trigger;

const DropdownMenuContent = DropdownMenu.menuify(
  (props: { tw?: TW } & ComponentProps<typeof DropdownMenu.Content>) => (
    <DropdownMenu.Content {...props} style={tailwind.style(props.tw)} />
  ),
  "Content"
);

type UseMotiAnimate<T> = T extends Animated.SharedValue<any>
  ? never
  : NonNullable<T>;

const DropdownItemFocusRing = ({
  isFocused,
}: {
  isFocused: Animated.SharedValue<boolean>;
}) => {
  // TODO moti should provide this
  const state = useDerivedValue<
    UseMotiAnimate<React.ComponentProps<typeof MotiView>["animate"]>
  >(() => {
    return {
      opacity: isFocused.value ? 1 : 0,
    };
  }, [isFocused]);

  return (
    <MotiView
      animate={state}
      style={tailwind.style("")}
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

const DropdownMenuItem = DropdownMenu.menuify(
  ({
    tw,
    children,
    onBlur,
    onFocus,
    ...props
  }: { tw?: TW } & ComponentProps<typeof DropdownMenu.Item>) => {
    const { isFocused, handleBlur, handleFocus } = useFocusedItem({
      onFocus,
      onBlur,
    });

    return (
      <DropdownMenu.Item
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={tailwind.style(tw)}
      >
        <DropdownItemFocusRing isFocused={isFocused} />
        {children}
      </DropdownMenu.Item>
    );
  },
  "Item"
);

const DropdownMenuCheckboxItem = DropdownMenu.menuify(
  ({
    tw,
    children,
    onBlur,
    onFocus,
    ...props
  }: { tw?: TW } & ComponentProps<typeof DropdownMenu.CheckboxItem>) => {
    const { isFocused, handleBlur, handleFocus } = useFocusedItem({
      onFocus,
      onBlur,
    });

    return (
      <DropdownMenu.CheckboxItem
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={tailwind.style(tw)}
      >
        <DropdownItemFocusRing isFocused={isFocused} />
        <DropdownMenu.ItemIndicator>
          {/* <Icon name="checkmark" color="textContrast" /> */}
        </DropdownMenu.ItemIndicator>
        {children}
      </DropdownMenu.CheckboxItem>
    );
  },
  "CheckboxItem"
);

const StyledDropdownMenuItemTitle = DropdownMenu.ItemTitle;

const DropdownMenuItemTitle = DropdownMenu.menuify(
  (
    props: ComponentProps<typeof Text> &
      ComponentProps<typeof DropdownMenu.ItemTitle>
  ) => (
    <StyledDropdownMenuItemTitle {...props} style={tailwind.style(props.tw)}>
      {/* <Text {...props} /> */}
      {props.children}
    </StyledDropdownMenuItemTitle>
  ),
  "ItemTitle"
);

const StyledDropdownMenuItemSubtitle = DropdownMenu.ItemSubtitle;

const DropdownMenuItemSubtitle = DropdownMenu.menuify(
  (
    props: ComponentProps<typeof Text> &
      ComponentProps<typeof DropdownMenu.ItemSubtitle>
  ) => (
    <StyledDropdownMenuItemSubtitle {...props}>
      {/* <Text {...props} /> */}
      {props.children}
    </StyledDropdownMenuItemSubtitle>
  ),
  "ItemSubtitle"
);

const DropdownMenuItemIndicator = DropdownMenu.menuify(
  (props: { tw?: TW } & ComponentProps<typeof DropdownMenu.ItemIndicator>) => (
    <DropdownMenu.ItemIndicator {...props} style={tailwind.style(props.tw)} />
  ),
  "ItemIndicator"
);

const DropdownMenuSeparator = DropdownMenu.menuify(
  (props: { tw?: TW } & ComponentProps<typeof DropdownMenu.Separator>) =>
    IS_WEB ? null : (
      <DropdownMenu.Separator {...props} style={tailwind.style(props.tw)} />
    ),
  "Separator"
);

const DropdownMenuTriggerItem = DropdownMenu.menuify(
  ({
    tw,
    children,
    onBlur,
    onFocus,
    ...props
  }: { tw?: TW } & ComponentProps<typeof DropdownMenu.TriggerItem>) => {
    const { isFocused, handleBlur, handleFocus } = useFocusedItem({
      onFocus,
      onBlur,
    });

    return (
      <DropdownMenu.TriggerItem
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={tailwind.style(tw)}
      >
        <DropdownItemFocusRing isFocused={isFocused} />
        {children}
      </DropdownMenu.TriggerItem>
    );
  },
  "TriggerItem"
);

const DropdownMenuItemIcon = DropdownMenu.menuify(
  (props: { tw?: TW } & ComponentProps<typeof DropdownMenu.ItemIcon>) => (
    <DropdownMenu.ItemIcon {...props} style={tailwind.style(props.tw)} />
  ),
  "ItemIcon"
);

const DropdownMenuItemImage = DropdownMenu.menuify(
  (props: { tw?: TW } & ComponentProps<typeof DropdownMenu.ItemImage>) => (
    <DropdownMenu.ItemImage {...props} style={tailwind.style(props.tw)} />
  ),
  "ItemImage"
);

const DropdownMenuLabel = DropdownMenu.menuify(
  (props: { tw?: TW } & ComponentProps<typeof DropdownMenu.Label>) => (
    <DropdownMenu.Label {...props} style={tailwind.style(props.tw)} />
  ),
  "Label"
);

export {
  DropdownMenuRoot,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuItemTitle,
  DropdownMenuItemSubtitle,
  DropdownMenuItemIndicator,
  DropdownMenuSeparator,
  DropdownMenuTriggerItem,
  DropdownMenuItemIcon,
  DropdownMenuItemImage,
  DropdownMenuLabel,
};
