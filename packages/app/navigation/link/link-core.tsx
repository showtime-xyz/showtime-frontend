import type { ComponentProps, ComponentType } from "react";

import NextLink from "next/link";
import { parseNextPath } from "solito/router";

import { useLinkTo } from "app/lib/react-navigation/native";

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
      onPress={(e?: any) => {
        componentProps?.onPress?.(e);
        if (!e?.defaultPrevented) {
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
