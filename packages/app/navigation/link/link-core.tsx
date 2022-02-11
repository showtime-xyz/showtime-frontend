import type { ComponentProps, ComponentType } from "react";

import { useLinkProps } from "@react-navigation/native";
import NextLink from "next/link";

import { parseNextPath } from "app/navigation/parse-next-path";
import { useRouter } from "app/navigation/use-router";

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
  const router = useRouter();
  const linkProps = useLinkProps({
    to: parseNextPath(href),
  });

  return (
    <Component
      {...linkProps}
      {...componentProps}
      onPress={() => {
        // If we are currently in NFT modal,
        // we need to close it before navigating to new page
        if (router?.pathname?.includes("/nft/")) {
          router.pop();
        }
        linkProps.onPress();
      }}
    >
      {children}
    </Component>
  );
}

export type { Props };
export { LinkCore };
