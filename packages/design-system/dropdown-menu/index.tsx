import { ComponentProps, useMemo, useCallback } from "react";

import { MotiView } from "moti";
import Animated, {
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { styled } from "tailwindcss-react-native";
import { useTailwind } from "tailwindcss-react-native";

import * as DropdownMenu from "app/zeego-menu/dropdown-menu/src/index";

import type { TW } from "design-system/tailwind/types";
import { Text } from "design-system/text";

const DropdownMenuRoot = DropdownMenu.Root;

const DropdownMenuGroup = DropdownMenu.Group;

const DropdownMenuTrigger = DropdownMenu.Trigger;

const DropdownMenuContent = DropdownMenu.menuify(
  (props: { tw?: TW } & ComponentProps<typeof DropdownMenu.Content>) => {
    const tailwind = useTailwind();

    return (
      <DropdownMenu.Content
        {...props}
        style={tailwind(
          Array.isArray(props.tw) ? props.tw.join(" ") : props.tw
        )}
      />
    );
  },
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
  const tailwind = useTailwind();

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
      style={tailwind("")}
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
    const tailwind = useTailwind();

    const { isFocused, handleBlur, handleFocus } = useFocusedItem({
      onFocus,
      onBlur,
    });

    return (
      <DropdownMenu.Item
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={tailwind(Array.isArray(tw) ? tw.join(" ") : tw)}
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
    const tailwind = useTailwind();

    const { isFocused, handleBlur, handleFocus } = useFocusedItem({
      onFocus,
      onBlur,
    });

    return (
      <DropdownMenu.CheckboxItem
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={tailwind(Array.isArray(tw) ? tw.join(" ") : tw)}
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

const StyledDropdownMenuItemTitle = styled(DropdownMenu.ItemTitle);

const DropdownMenuItemTitle = DropdownMenu.menuify(
  (
    props: ComponentProps<typeof Text> &
      ComponentProps<typeof DropdownMenu.ItemTitle>
  ) => (
    <StyledDropdownMenuItemTitle>
      <Text {...props} />
    </StyledDropdownMenuItemTitle>
  ),
  "ItemTitle"
);

const StyledDropdownMenuItemSubtitle = styled(DropdownMenu.ItemSubtitle);

const DropdownMenuItemSubtitle = DropdownMenu.menuify(
  (
    props: ComponentProps<typeof Text> &
      ComponentProps<typeof DropdownMenu.ItemSubtitle>
  ) => (
    <StyledDropdownMenuItemSubtitle {...props}>
      <Text {...props} />
    </StyledDropdownMenuItemSubtitle>
  ),
  "ItemSubtitle"
);

const DropdownMenuItemIndicator = DropdownMenu.menuify(
  (props: { tw?: TW } & ComponentProps<typeof DropdownMenu.ItemIndicator>) => {
    const tailwind = useTailwind();

    return (
      <DropdownMenu.ItemIndicator
        {...props}
        style={tailwind(
          Array.isArray(props.tw) ? props.tw.join(" ") : props.tw
        )}
      />
    );
  },
  "ItemIndicator"
);

const DropdownMenuSeparator = DropdownMenu.menuify(
  (props: { tw?: TW } & ComponentProps<typeof DropdownMenu.Separator>) => {
    const tailwind = useTailwind();

    return (
      <DropdownMenu.Separator
        {...props}
        style={tailwind(
          Array.isArray(props.tw) ? props.tw.join(" ") : props.tw
        )}
      />
    );
  },
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
    const tailwind = useTailwind();

    const { isFocused, handleBlur, handleFocus } = useFocusedItem({
      onFocus,
      onBlur,
    });

    return (
      <DropdownMenu.TriggerItem
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={tailwind(Array.isArray(tw) ? tw.join(" ") : tw)}
      >
        <DropdownItemFocusRing isFocused={isFocused} />
        {children}
      </DropdownMenu.TriggerItem>
    );
  },
  "TriggerItem"
);

const DropdownMenuItemIcon = DropdownMenu.menuify(
  (props: { tw?: TW } & ComponentProps<typeof DropdownMenu.ItemIcon>) => {
    const tailwind = useTailwind();

    return (
      <DropdownMenu.ItemIcon
        {...props}
        style={tailwind(
          Array.isArray(props.tw) ? props.tw.join(" ") : props.tw
        )}
      />
    );
  },
  "ItemIcon"
);

const DropdownMenuItemImage = DropdownMenu.menuify(
  (props: { tw?: TW } & ComponentProps<typeof DropdownMenu.ItemImage>) => {
    const tailwind = useTailwind();

    return (
      <DropdownMenu.ItemImage
        {...props}
        style={tailwind(
          Array.isArray(props.tw) ? props.tw.join(" ") : props.tw
        )}
      />
    );
  },
  "ItemImage"
);

const DropdownMenuLabel = DropdownMenu.menuify(
  (props: { tw?: TW } & ComponentProps<typeof DropdownMenu.Label>) => {
    const tailwind = useTailwind();

    return (
      <DropdownMenu.Label
        {...props}
        style={tailwind(
          Array.isArray(props.tw) ? props.tw.join(" ") : props.tw
        )}
      />
    );
  },
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
