import type { ComponentProps, ComponentType } from "react";

import NextLink from "next/link";

import { useLinkProps } from "app/lib/react-navigation/native";
import { parseNextPath } from "app/navigation/parse-next-path";

type Props = {
  children: React.ReactNode;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
  onPress?: () => void;
} & Omit<ComponentProps<typeof NextLink>, "passHref">;

function LinkCore({
  children,
  href,
  as,
  hitSlop,
  componentProps,
  onPress,
  Component,
}: Props & {
  Component: ComponentType<any>;
  componentProps?: any;
}) {
  const linkProps = useLinkProps({
    to: parseNextPath(href),
  });

  return (
    <Component
      {...linkProps}
      {...componentProps}
      onPress={() => {
        onPress?.();
        // If we are currently in NFT modal,
        // we need to close it before navigating to new page
        linkProps.onPress();
      }}
    >
      {children}
    </Component>
  );
}

export type { Props };
export { LinkCore };
