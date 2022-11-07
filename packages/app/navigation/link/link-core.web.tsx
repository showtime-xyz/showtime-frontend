import type { ComponentProps, ComponentType } from "react";

import NextLink from "next/link";

type Props = {
  children: React.ReactNode;
  onPress?: (e: any) => void;
  dataset?: any;
} & Omit<ComponentProps<typeof NextLink>, "passHref">;

function LinkCore({
  children,
  href = "#",
  as,
  componentProps,
  Component,
  ...props
}: Props & {
  Component: ComponentType<any>;
  componentProps?: any;
}) {
  return (
    <NextLink {...props} href={href} as={as} passHref>
      <Component {...componentProps} onClick={componentProps?.onPress}>
        {children}
      </Component>
    </NextLink>
  );
}

export type { Props };
export { LinkCore };
