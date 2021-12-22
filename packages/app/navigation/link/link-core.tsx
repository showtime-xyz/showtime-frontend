import type { ComponentProps, ComponentType } from "react";
import { useLinkProps } from "@react-navigation/native";
import NextLink from "next/link";

import { parseNextPath } from "app/navigation/parse-next-path";

type Props = {
  children: React.ReactNode;
} & Omit<ComponentProps<typeof NextLink>, "passHref">;

function LinkCore({
  children,
  href,
  as,
  componentProps,
  Component,
  ...props
}: Props & {
  Component: ComponentType<any>;
  componentProps?: any;
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const linkProps = useLinkProps({
    to: parseNextPath(as ?? href), // TODO: should this prefer href or as?
  });

  return (
    <Component {...componentProps} {...linkProps}>
      {children}
    </Component>
  );
}

export type { Props };
export { LinkCore };
