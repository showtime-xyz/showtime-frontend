import type { ComponentProps, ComponentType } from "react";
import { useLinkProps } from "@react-navigation/native";
import NextLink from "next/link";

import { parseNextPath } from "app/navigation/parse-next-path";
import { Pressable } from "design-system/pressable-scale";

type Props = {
  children: React.ReactNode;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
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
  const linkProps = useLinkProps({
    to: parseNextPath(href),
  });

  return (
    <Pressable {...linkProps} hitSlop={hitSlop}>
      <Component {...componentProps}>{children}</Component>
    </Pressable>
  );
}

export type { Props };
export { LinkCore };
