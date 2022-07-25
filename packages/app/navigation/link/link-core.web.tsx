import type { ComponentProps, ComponentType } from "react";
import { Platform } from "react-native";

import NextLink from "next/link";

type Props = {
  children: React.ReactNode;
  onPress?: (e: any) => void;
  dataSet?: any;
} & Omit<ComponentProps<typeof NextLink>, "passHref">;

function LinkCore({
  children,
  href = "#",
  as,
  componentProps,
  Component,
  dataSet,
  ...props
}: Props & {
  Component: ComponentType<any>;
  componentProps?: any;
}) {
  return (
    <NextLink {...props} href={href} as={as} passHref>
      <Component
        {...componentProps}
        onClick={componentProps?.onPress}
        dataSet={Platform.select({ web: dataSet })}
      >
        {children}
      </Component>
    </NextLink>
  );
}

export type { Props };
export { LinkCore };
