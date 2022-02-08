import { TextProps, ViewProps } from "react-native";

import { Text } from "design-system/text";
import { Pressable } from "design-system/pressable-scale";
import type { TW } from "design-system/tailwind/types";

import { Props, LinkCore } from "app/navigation/link/link-core";
import { useMemo } from "react";

type LinkProps = Props & { viewProps?: ViewProps; tw?: TW };

function Link({ viewProps, tw, ...props }: LinkProps) {
  return (
    <LinkCore
      {...props}
      Component={Pressable}
      componentProps={{ ...viewProps, tw }}
    />
  );
}

type TextLinkProps = Props & {
  textProps?: TextProps;
  variant?: string;
  tw?: TW;
};

const DEFAULT_TEXT_LINK_HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

function TextLink({
  textProps,
  variant,
  tw,
  hitSlop,
  ...props
}: TextLinkProps) {
  return (
    <LinkCore
      {...props}
      hitSlop={hitSlop ?? DEFAULT_TEXT_LINK_HIT_SLOP}
      Component={Text}
      componentProps={useMemo(
        () => ({
          ...textProps,
          variant,
          tw,
          accessibilityRole: "link",
        }),
        [variant, tw, textProps]
      )}
    />
  );
}

export { Link, TextLink };
