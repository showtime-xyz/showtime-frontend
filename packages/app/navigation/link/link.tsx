import { useMemo } from "react";
import { Platform, TextProps, ViewProps } from "react-native";

import { Text } from "@showtime-xyz/universal.text";

import { LinkCore, Props } from "app/navigation/link/link-core";

import { PressableScale } from "design-system/pressable-scale";
import type { TW } from "design-system/tailwind/types";
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

function Link({ viewProps, tw, hrefAttrs, onPress, ...props }: LinkProps) {
  return (
    <LinkCore
      {...props}
      Component={Platform.select({
        web: View,
        default: PressableScale as any,
      })}
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
      hitSlop={hitSlop ?? DEFAULT_TEXT_LINK_HIT_SLOP}
      Component={Platform.select({
        web: View,
        default: Text as any,
      })}
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
    />
  );
}

export { Link, TextLink };
