import { ComponentProps } from "react";

import { Skeleton as MotiSkeleton } from "moti/skeleton";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

type Props = ComponentProps<typeof MotiSkeleton> & {
  tw?: TW;
};

function Skeleton({ tw, ...props }: Props) {
  return <MotiSkeleton {...props} {...tailwind.style(tw)} />;
}

Skeleton.displayName = "Skeleton";

export { Skeleton };
