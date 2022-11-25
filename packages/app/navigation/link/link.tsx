import { useMemo } from "react";
import { Platform, TextProps, ViewProps } from "react-native";

import { Pressable } from "@showtime-xyz/universal.pressable";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { LinkCore, Props } from "app/navigation/link/link-core";

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

function Link({ viewProps, tw, hrefAttrs, onPress, ...props }: LinkProps) {
  return (
    <LinkCore
      {...props}
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
  ...props
}: TextLinkProps) {
  return (
    <LinkCore
      {...props}
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
