import type { ComponentProps, ComponentType } from "react";
import { Linking } from "react-native";

import NextLink from "next/link";
import { parseNextPath } from "solito/router";

import { useLinkTo } from "app/lib/react-navigation/native";

import { Logger } from "../../lib/logger";

type Props = {
  children: React.ReactNode;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
  onPress?: (e: any) => void;
} & Omit<ComponentProps<typeof NextLink>, "passHref">;

function LinkCore({
  children,
  href,
  as,
  hitSlop,
  componentProps,
  Component,
}: Props & {
  Component: ComponentType<any>;
  componentProps?: any;
}) {
  const linkTo = useLinkTo();

  return (
    <Component
      accessibilityRole="link"
      hitSlop={hitSlop}
      {...componentProps}
      onPress={async (e?: any) => {
        componentProps?.onPress?.(e);
        if (!e?.defaultPrevented) {
          if (typeof href === "string" && href.startsWith("http")) {
            const isCanOpen = await Linking.canOpenURL(href);
            if (isCanOpen) {
              Linking.openURL(href);
              return;
            } else {
              Logger.error(`Can't open href: ${href}`);
            }
          }

          linkTo(parseNextPath(as || href));
        }
      }}
    >
      {children}
    </Component>
  );
}

export type { Props };
export { LinkCore };
