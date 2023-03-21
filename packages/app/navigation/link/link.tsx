import { useMemo } from "react";
import { Platform, TextProps, ViewProps } from "react-native";

import { LinkCore, Props } from "app/navigation/link/link-core";

import { Pressable } from "design-system/pressable";
import type { TW } from "design-system/tailwind";
import { Text } from "design-system/text";
import { View } from "design-system/view";

export type LinkProps = Props & {
  viewProps?: ViewProps;
  tw?: TW;
  dataset?: any;
  /**
   * **WEB ONLY**
   */
  hrefAttrs?: {
    rel: "noreferrer";
    target?: "_blank";
  };
};

function Link({ viewProps, tw, hrefAttrs, onPress, ...rest }: LinkProps) {
  return (
    <LinkCore
      {...rest}
      Component={Platform.select({
        web: View,
        default: Pressable as any,
      })}
      {...hrefAttrs}
      componentProps={{
        ...viewProps,
        tw,
        hrefAttrs,
        onPress,
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
  onPress,
  ...rest
}: TextLinkProps) {
  return (
    <LinkCore
      {...rest}
      Component={Text}
      componentProps={useMemo(
        () => ({
          ...textProps,
          variant,
          tw,
          accessibilityRole: "link",
          selectable: false,
          onPress,
        }),
        [variant, tw, textProps, onPress]
      )}
      {...Platform.select({
        web: {},
        default: {
          hitSlop: hitSlop ?? DEFAULT_TEXT_LINK_HIT_SLOP,
        },
      })}
    />
  );
}

export { Link, TextLink };
