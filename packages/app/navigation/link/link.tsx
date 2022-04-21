import { useMemo } from "react";
import { TextProps, ViewProps, Platform } from "react-native";

import { Props, LinkCore } from "app/navigation/link/link-core";

import { Pressable } from "design-system/pressable-scale";
import type { TW } from "design-system/tailwind/types";
import { Text } from "design-system/text";
import { View } from "design-system/view";

type LinkProps = Props & {
  viewProps?: ViewProps;
  tw?: TW;
  // react-native-web only types
  hrefAttrs?: {
    rel: "noreferrer";
    target?: "_blank";
  };
};

function Link({ viewProps, tw, hrefAttrs, ...props }: LinkProps) {
  return (
    <LinkCore
      {...props}
      Component={Platform.select({
        web: View,
        default: Pressable as any,
      })}
      componentProps={{
        ...viewProps,
        tw,
        hrefAttrs,
      }}
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
          selectable: false,
        }),
        [variant, tw, textProps]
      )}
    />
  );
}

export { Link, TextLink };
