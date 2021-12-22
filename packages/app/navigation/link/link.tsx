import { Platform, TextProps, ViewProps } from "react-native";

import { Pressable } from "design-system/pressable-scale";
import { Text } from "design-system/text";
import { View } from "design-system/view";

import { Props, LinkCore } from "app/navigation/link/link-core";

type LinkProps = Props & { viewProps?: ViewProps };

function Link({ viewProps, ...props }: LinkProps) {
  return (
    <LinkCore
      {...props}
      Component={Platform.select({
        web: View,
        default: Pressable as any,
      })}
      componentProps={viewProps}
    />
  );
}

type TextLinkProps = Props & {
  textProps?: TextProps;
  variant?: string;
  tw?: string;
};

function TextLink({ textProps, variant, tw, ...props }: TextLinkProps) {
  return (
    <LinkCore
      {...props}
      Component={Text}
      componentProps={{ ...textProps, variant, tw, accessibilityRole: "link" }}
    />
  );
}

export { Link, TextLink };
